"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import {
  CloudUploadIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  PlusIcon,
  RotateCcwIcon,
  Trash2Icon,
  UploadIcon,
  XIcon,
} from "lucide-react"
import {
  ErrorCode,
  useDropzone,
  type Accept,
  type DropzoneInputProps,
  type FileError,
  type FileRejection,
} from "react-dropzone"

import { cn } from "@carsxe/design-system/lib/utils"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@carsxe/design-system/components/attachment"
import { Button } from "@carsxe/design-system/components/button"
import { Progress } from "@carsxe/design-system/components/progress"

type FileUploadStatus =
  "pending" | "queued" | "uploading" | "done" | "error" | "cancelled"

type FileUploadItem = {
  id: string
  file: File
  status: FileUploadStatus
  /** Percentage from 0 to 100. */
  progress: number
  /** Bytes sent so far. */
  loaded: number
  /** Total bytes to send; the file size until the transport reports otherwise. */
  total: number
  error?: string
  response?: unknown
  /** Object URL for image files, revoked when the file leaves the list. */
  previewUrl?: string
}

type FileUploadRejectionError = { code: string; message: string }

type FileUploadRejection = {
  id: string
  file: File
  errors: FileUploadRejectionError[]
}

type FileUploadProgressHandler = {
  /** Report bytes sent: `onProgress(loaded, total)`. */
  (loaded: number, total: number): void
  /** Report a percentage from 0 to 100: `onProgress(percent)`. */
  (percent: number): void
}

type FileUploader = (
  file: File,
  context: {
    onProgress: FileUploadProgressHandler
    signal: AbortSignal
    item: FileUploadItem
  }
) => Promise<unknown>

type FileUploadMessages = {
  fileTooLarge: (args: { file: File; maxSize: number }) => string
  fileTooSmall: (args: { file: File; minSize: number }) => string
  fileInvalidType: (args: { file: File; accept: string }) => string
  tooManyFiles: (args: { file: File; maxFiles: number }) => string
  uploadFailed: (args: { file: File; error: unknown }) => string
}

type FileUploadOptions = {
  /** Allowed types, keyed by MIME type: `{ "image/*": [".png", ".jpg"] }`. */
  accept?: Accept
  /** Largest allowed file in bytes. */
  maxSize?: number
  /** Smallest allowed file in bytes. */
  minSize?: number
  /** Most files the list may hold, counting files already added. */
  maxFiles?: number
  /** Allow picking several files at once. Defaults to `true`. */
  multiple?: boolean
  /** Extra per-file check. Return `null` to accept. */
  validator?: (file: File) => FileError | readonly FileError[] | null
  disabled?: boolean
  /** Upload files as soon as they are added. */
  auto?: boolean
  /** Most uploads running at the same time. Defaults to `3`. */
  concurrency?: number
  /** Create object URL previews for image files. Defaults to `true`. */
  previewImages?: boolean

  /** Built-in upload: endpoint that receives each file with XMLHttpRequest. */
  url?: string
  method?: "POST" | "PUT" | "PATCH"
  /** Form field name for the file. Defaults to `"file"`. */
  name?: string
  headers?: Record<string, string>
  withCredentials?: boolean
  /** Build the request body. Defaults to a FormData with the file under `name`. */
  formData?: (file: File) => XMLHttpRequestBodyInit
  /** Custom upload. Takes precedence over `url`. */
  uploader?: FileUploader

  /** Controlled list of files. */
  value?: FileUploadItem[]
  onValueChange?: (files: FileUploadItem[]) => void

  messages?: Partial<FileUploadMessages>

  onSelect?: (items: FileUploadItem[]) => void
  onReject?: (rejections: FileUploadRejection[]) => void
  /** Return `false` to leave the file pending instead of uploading it. */
  onBeforeUpload?: (item: FileUploadItem) => boolean | void
  onProgress?: (item: FileUploadItem) => void
  onUpload?: (item: FileUploadItem, response: unknown) => void
  onError?: (item: FileUploadItem, error: unknown) => void
  onRemove?: (item: FileUploadItem) => void
  onClear?: () => void
  /** Fires once the queue drains after at least one upload settled. */
  onAllComplete?: (items: FileUploadItem[]) => void
}

const defaultMessages: FileUploadMessages = {
  fileTooLarge: ({ file, maxSize }) =>
    `${file.name} is larger than ${formatBytes(maxSize)}.`,
  fileTooSmall: ({ file, minSize }) =>
    `${file.name} is smaller than ${formatBytes(minSize)}.`,
  fileInvalidType: ({ file, accept }) =>
    accept
      ? `${file.name} isn't an allowed file type. Use ${accept}.`
      : `${file.name} isn't an allowed file type.`,
  tooManyFiles: ({ file, maxFiles }) =>
    `${file.name} wasn't added. You can upload up to ${maxFiles} ${maxFiles === 1 ? "file" : "files"}.`,
  uploadFailed: ({ error }) =>
    error instanceof Error && error.message ? error.message : "Upload failed.",
}

function formatBytes(bytes: number, decimals = 1) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B"
  const units = ["B", "KB", "MB", "GB", "TB"]
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  )
  const value = bytes / 1024 ** exponent
  const rounded = exponent === 0 ? value : Number(value.toFixed(decimals))
  return `${rounded} ${units[exponent]}`
}

function describeAccept(accept: Accept | undefined) {
  if (!accept) return ""
  const labels = Object.entries(accept).flatMap(([mime, extensions]) =>
    extensions.length
      ? extensions.map((extension) =>
          extension.replace(/^\./, "").toUpperCase()
        )
      : [mime]
  )
  return Array.from(new Set(labels)).join(", ")
}

function describeConstraints({
  accept,
  maxSize,
  maxFiles,
}: Pick<FileUploadOptions, "accept" | "maxSize" | "maxFiles">) {
  return [
    describeAccept(accept),
    maxSize ? `Up to ${formatBytes(maxSize)} each` : "",
    maxFiles ? `${maxFiles} ${maxFiles === 1 ? "file" : "files"} max` : "",
  ]
    .filter(Boolean)
    .join(" · ")
}

let fileIdCounter = 0
function createFileId() {
  fileIdCounter += 1
  return `file-${Date.now().toString(36)}-${fileIdCounter}`
}

function createAbortError() {
  return new DOMException("The upload was cancelled.", "AbortError")
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError"
}

function parseResponse(xhr: XMLHttpRequest) {
  if (xhr.responseType && xhr.responseType !== "text") return xhr.response
  const text = xhr.responseText
  try {
    return text ? JSON.parse(text) : null
  } catch {
    return text
  }
}

/** Uploads one file with XMLHttpRequest, the only browser API that reports upload progress. */
function xhrUpload(
  file: File,
  {
    url,
    method = "POST",
    name = "file",
    headers,
    withCredentials,
    formData,
  }: Pick<
    FileUploadOptions,
    "method" | "name" | "headers" | "withCredentials" | "formData"
  > & { url: string },
  {
    onProgress,
    signal,
  }: { onProgress: FileUploadProgressHandler; signal: AbortSignal }
) {
  return new Promise<unknown>((resolve, reject) => {
    if (signal.aborted) {
      reject(createAbortError())
      return
    }

    const xhr = new XMLHttpRequest()
    const abort = () => xhr.abort()

    xhr.open(method, url)
    xhr.withCredentials = Boolean(withCredentials)
    for (const [header, value] of Object.entries(headers ?? {})) {
      xhr.setRequestHeader(header, value)
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded, event.total)
    }
    xhr.onload = () => {
      signal.removeEventListener("abort", abort)
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(parseResponse(xhr))
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}.`))
      }
    }
    xhr.onerror = () => {
      signal.removeEventListener("abort", abort)
      reject(new Error("Network error while uploading."))
    }
    xhr.onabort = () => {
      signal.removeEventListener("abort", abort)
      reject(createAbortError())
    }
    signal.addEventListener("abort", abort, { once: true })

    let body: XMLHttpRequestBodyInit
    if (formData) {
      body = formData(file)
    } else {
      const data = new FormData()
      data.append(name, file, file.name)
      body = data
    }
    xhr.send(body)
  })
}

function useLatest<T>(value: T) {
  const ref = React.useRef(value)
  React.useLayoutEffect(() => {
    ref.current = value
  })
  return ref
}

function useFileUpload(options: FileUploadOptions = {}) {
  const {
    accept,
    maxSize,
    minSize,
    maxFiles,
    multiple = true,
    validator,
    disabled = false,
    previewImages = true,
    value,
  } = options
  const optionsRef = useLatest(options)
  const messages = React.useMemo(
    () => ({ ...defaultMessages, ...options.messages }),
    [options.messages]
  )
  const messagesRef = useLatest(messages)

  const isControlled = value !== undefined
  const [internalFiles, setInternalFiles] = React.useState<FileUploadItem[]>([])
  const files = isControlled ? value : internalFiles
  // Async upload callbacks read and write through this ref so progress from
  // several uploads never clobbers each other between renders.
  const filesRef = React.useRef(files)
  const lastValueRef = React.useRef(value)
  if (isControlled && value !== lastValueRef.current) {
    filesRef.current = value
  }
  lastValueRef.current = value

  const [rejections, setRejections] = React.useState<FileUploadRejection[]>([])
  const [announcement, setAnnouncement] = React.useState("")

  const setFiles = React.useCallback(
    (update: (current: FileUploadItem[]) => FileUploadItem[]) => {
      const next = update(filesRef.current)
      if (next === filesRef.current) return
      filesRef.current = next
      if (!optionsRef.current.value) setInternalFiles(next)
      optionsRef.current.onValueChange?.(next)
    },
    [optionsRef]
  )

  const patchFile = React.useCallback(
    (id: string, patch: Partial<FileUploadItem>) => {
      let updated: FileUploadItem | undefined
      setFiles((current) =>
        current.map((item) => {
          if (item.id !== id) return item
          updated = { ...item, ...patch }
          return updated
        })
      )
      return updated
    },
    [setFiles]
  )

  const queueRef = React.useRef<string[]>([])
  const controllersRef = React.useRef(new Map<string, AbortController>())
  const settledInBatchRef = React.useRef(false)

  const canUpload = Boolean(options.uploader || options.url)

  const finishBatchIfIdle = React.useCallback(() => {
    if (
      queueRef.current.length === 0 &&
      controllersRef.current.size === 0 &&
      settledInBatchRef.current
    ) {
      settledInBatchRef.current = false
      optionsRef.current.onAllComplete?.(filesRef.current)
    }
  }, [optionsRef])

  const pumpRef = React.useRef<() => void>(() => undefined)

  const runUpload = React.useCallback(
    async (id: string) => {
      const item = filesRef.current.find((file) => file.id === id)
      if (!item) return
      const opts = optionsRef.current

      if (opts.onBeforeUpload?.(item) === false) {
        patchFile(id, { status: "pending" })
        return
      }

      const controller = new AbortController()
      controllersRef.current.set(id, controller)
      const started = patchFile(id, {
        status: "uploading",
        progress: 0,
        loaded: 0,
        total: item.file.size,
        error: undefined,
      })

      const onProgress = ((loadedOrPercent: number, total?: number) => {
        if (controller.signal.aborted) return
        const size = total ?? item.file.size
        const loaded =
          total === undefined
            ? (Math.min(Math.max(loadedOrPercent, 0), 100) / 100) * size
            : Math.min(Math.max(loadedOrPercent, 0), size)
        const progress = size > 0 ? Math.round((loaded / size) * 100) : 100
        const next = patchFile(id, { loaded, total: size, progress })
        if (next) optionsRef.current.onProgress?.(next)
      }) as FileUploadProgressHandler

      try {
        const response = opts.uploader
          ? await opts.uploader(item.file, {
              onProgress,
              signal: controller.signal,
              item: started ?? item,
            })
          : await xhrUpload(
              item.file,
              { ...opts, url: opts.url as string },
              { onProgress, signal: controller.signal }
            )
        if (controller.signal.aborted) throw createAbortError()
        const done = patchFile(id, {
          status: "done",
          progress: 100,
          loaded: item.file.size,
          total: item.file.size,
          response,
        })
        setAnnouncement(`${item.file.name} uploaded.`)
        if (done) optionsRef.current.onUpload?.(done, response)
      } catch (error) {
        if (controller.signal.aborted || isAbortError(error)) {
          if (filesRef.current.some((file) => file.id === id)) {
            patchFile(id, { status: "cancelled", progress: 0, loaded: 0 })
            setAnnouncement(`${item.file.name} upload cancelled.`)
          }
        } else {
          const message = messagesRef.current.uploadFailed({
            file: item.file,
            error,
          })
          const failed = patchFile(id, { status: "error", error: message })
          setAnnouncement(`${item.file.name} failed to upload. ${message}`)
          if (failed) optionsRef.current.onError?.(failed, error)
        }
      } finally {
        controllersRef.current.delete(id)
        settledInBatchRef.current = true
        pumpRef.current()
      }
    },
    [messagesRef, optionsRef, patchFile]
  )

  const pump = React.useCallback(() => {
    const limit = Math.max(1, optionsRef.current.concurrency ?? 3)
    while (controllersRef.current.size < limit && queueRef.current.length > 0) {
      const id = queueRef.current.shift() as string
      void runUpload(id)
    }
    finishBatchIfIdle()
  }, [finishBatchIfIdle, optionsRef, runUpload])
  pumpRef.current = pump

  const enqueue = React.useCallback(
    (ids: string[]) => {
      if (!optionsRef.current.uploader && !optionsRef.current.url) return
      const queueable = ids.filter(
        (id) =>
          !queueRef.current.includes(id) && !controllersRef.current.has(id)
      )
      if (queueable.length === 0) return
      setFiles((current) =>
        current.map((item) =>
          queueable.includes(item.id)
            ? {
                ...item,
                status: "queued",
                progress: 0,
                loaded: 0,
                error: undefined,
              }
            : item
        )
      )
      queueRef.current.push(...queueable)
      pump()
    },
    [optionsRef, pump, setFiles]
  )

  const upload = React.useCallback(() => {
    enqueue(
      filesRef.current
        .filter((item) => item.status === "pending")
        .map((item) => item.id)
    )
  }, [enqueue])

  const uploadFile = React.useCallback((id: string) => enqueue([id]), [enqueue])

  const retry = React.useCallback(
    (id: string) => {
      const item = filesRef.current.find((file) => file.id === id)
      if (item && (item.status === "error" || item.status === "cancelled")) {
        enqueue([id])
      }
    },
    [enqueue]
  )

  const cancel = React.useCallback(
    (id?: string) => {
      const ids = id
        ? [id]
        : filesRef.current
            .filter(
              (item) => item.status === "queued" || item.status === "uploading"
            )
            .map((item) => item.id)
      const dequeued = ids.filter((itemId) => queueRef.current.includes(itemId))
      queueRef.current = queueRef.current.filter(
        (itemId) => !ids.includes(itemId)
      )
      if (dequeued.length) {
        setFiles((current) =>
          current.map((item) =>
            dequeued.includes(item.id)
              ? { ...item, status: "cancelled", progress: 0, loaded: 0 }
              : item
          )
        )
      }
      for (const itemId of ids) controllersRef.current.get(itemId)?.abort()
      finishBatchIfIdle()
    },
    [finishBatchIfIdle, setFiles]
  )

  const remove = React.useCallback(
    (id: string) => {
      const item = filesRef.current.find((file) => file.id === id)
      if (!item) return
      queueRef.current = queueRef.current.filter((itemId) => itemId !== id)
      controllersRef.current.get(id)?.abort()
      setFiles((current) => current.filter((file) => file.id !== id))
      optionsRef.current.onRemove?.(item)
      finishBatchIfIdle()
    },
    [finishBatchIfIdle, optionsRef, setFiles]
  )

  const clear = React.useCallback(() => {
    queueRef.current = []
    for (const controller of controllersRef.current.values()) {
      controller.abort()
    }
    setFiles(() => [])
    setRejections([])
    settledInBatchRef.current = false
    optionsRef.current.onClear?.()
  }, [optionsRef, setFiles])

  const dismissRejection = React.useCallback((id: string) => {
    setRejections((current) =>
      current.filter((rejection) => rejection.id !== id)
    )
  }, [])

  const toRejection = React.useCallback(
    (file: File, errors: readonly FileError[]): FileUploadRejection => {
      const opts = optionsRef.current
      const copy = messagesRef.current
      return {
        id: createFileId(),
        file,
        errors: errors.map((error) => {
          switch (error.code) {
            case ErrorCode.FileTooLarge:
              return {
                code: error.code,
                message: copy.fileTooLarge({
                  file,
                  maxSize: opts.maxSize ?? 0,
                }),
              }
            case ErrorCode.FileTooSmall:
              return {
                code: error.code,
                message: copy.fileTooSmall({
                  file,
                  minSize: opts.minSize ?? 0,
                }),
              }
            case ErrorCode.FileInvalidType:
              return {
                code: error.code,
                message: copy.fileInvalidType({
                  file,
                  accept: describeAccept(opts.accept),
                }),
              }
            case ErrorCode.TooManyFiles:
              return {
                code: error.code,
                message: copy.tooManyFiles({
                  file,
                  maxFiles: opts.maxFiles ?? 1,
                }),
              }
            default:
              return { code: String(error.code), message: error.message }
          }
        }),
      }
    },
    [messagesRef, optionsRef]
  )

  const onDrop = React.useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      const opts = optionsRef.current
      const limit = opts.multiple === false ? 1 : opts.maxFiles
      // react-dropzone only counts the current drop, so the limit is applied
      // here against the files already in the list.
      const replacing = opts.multiple === false
      const room =
        limit === undefined
          ? accepted.length
          : Math.max(0, limit - (replacing ? 0 : filesRef.current.length))
      const kept = accepted.slice(0, room)
      const overflow = accepted.slice(room)

      const nextRejections = [
        ...rejected.map((rejection) =>
          toRejection(rejection.file, rejection.errors)
        ),
        ...overflow.map((file) =>
          toRejection(file, [
            { code: ErrorCode.TooManyFiles, message: "Too many files" },
          ])
        ),
      ]
      setRejections(nextRejections)
      if (nextRejections.length) opts.onReject?.(nextRejections)

      if (kept.length === 0) return
      const items: FileUploadItem[] = kept.map((file) => ({
        id: createFileId(),
        file,
        status: "pending",
        progress: 0,
        loaded: 0,
        total: file.size,
        previewUrl:
          (opts.previewImages ?? true) &&
          file.type.startsWith("image/") &&
          typeof URL.createObjectURL === "function"
            ? URL.createObjectURL(file)
            : undefined,
      }))

      if (replacing) {
        for (const item of filesRef.current) {
          queueRef.current = queueRef.current.filter((id) => id !== item.id)
          controllersRef.current.get(item.id)?.abort()
        }
        setFiles(() => items)
      } else {
        setFiles((current) => [...current, ...items])
      }
      opts.onSelect?.(items)
      if (opts.auto) enqueue(items.map((item) => item.id))
    },
    [enqueue, optionsRef, setFiles, toRejection]
  )

  const dropzone = useDropzone({
    accept,
    maxSize,
    minSize,
    multiple,
    validator,
    disabled,
    onDrop,
  })

  // Revoke previews for files that left the list, and all of them on unmount.
  const previewsRef = React.useRef(new Set<string>())
  React.useEffect(() => {
    const current = new Set(
      files.map((item) => item.previewUrl).filter(Boolean) as string[]
    )
    for (const url of previewsRef.current) {
      if (!current.has(url)) URL.revokeObjectURL(url)
    }
    previewsRef.current = current
  }, [files])
  React.useEffect(() => {
    const controllers = controllersRef.current
    const previews = previewsRef
    return () => {
      for (const controller of controllers.values()) controller.abort()
      for (const url of previews.current) URL.revokeObjectURL(url)
      previews.current = new Set()
    }
  }, [])

  const totals = files.reduce(
    (sum, item) => {
      if (
        item.status === "queued" ||
        item.status === "uploading" ||
        item.status === "done"
      ) {
        sum.loaded += item.status === "done" ? item.total : item.loaded
        sum.total += item.total
      }
      return sum
    },
    { loaded: 0, total: 0 }
  )
  const totalProgress =
    totals.total > 0 ? Math.round((totals.loaded / totals.total) * 100) : 0
  const isUploading = files.some(
    (item) => item.status === "queued" || item.status === "uploading"
  )

  return {
    files,
    rejections,
    totalProgress,
    isUploading,
    canUpload,
    disabled,
    announcement,
    constraints: describeConstraints({ accept, maxSize, maxFiles }),
    maxSize,
    open: dropzone.open,
    upload,
    uploadFile,
    cancel,
    retry,
    remove,
    clear,
    dismissRejection,
    getRootProps: dropzone.getRootProps,
    getInputProps: dropzone.getInputProps,
    isDragActive: dropzone.isDragActive,
    // react-dropzone leaves isDragReject set after a drop; only report it mid-drag.
    isDragReject: dropzone.isDragActive && dropzone.isDragReject,
    isFocused: dropzone.isFocused,
    previewImages,
  }
}

type FileUploadState = ReturnType<typeof useFileUpload>

type FileUploadContextValue = FileUploadState & {
  hintId: string
  hasHint: boolean
  setHasHint: (value: boolean) => void
}

const FileUploadContext = React.createContext<FileUploadContextValue | null>(
  null
)

function useFileUploadContext() {
  const context = React.useContext(FileUploadContext)
  if (!context) {
    throw new Error("FileUpload parts must be rendered inside <FileUpload>.")
  }
  return context
}

const fileUploadOptionKeys = [
  "accept",
  "maxSize",
  "minSize",
  "maxFiles",
  "multiple",
  "validator",
  "disabled",
  "auto",
  "concurrency",
  "previewImages",
  "url",
  "method",
  "name",
  "headers",
  "withCredentials",
  "formData",
  "uploader",
  "value",
  "onValueChange",
  "messages",
  "onSelect",
  "onReject",
  "onBeforeUpload",
  "onProgress",
  "onUpload",
  "onError",
  "onRemove",
  "onClear",
  "onAllComplete",
] as const satisfies readonly (keyof FileUploadOptions)[]

function splitFileUploadProps<T extends FileUploadOptions>(props: T) {
  const options: Record<string, unknown> = {}
  const rest: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(props)) {
    if ((fileUploadOptionKeys as readonly string[]).includes(key)) {
      options[key] = value
    } else {
      rest[key] = value
    }
  }
  return {
    options: options as FileUploadOptions,
    rest: rest as Omit<T, keyof FileUploadOptions>,
  }
}

type FileUploadProps = FileUploadOptions &
  Omit<React.ComponentProps<"div">, keyof FileUploadOptions>

function FileUpload(props: FileUploadProps) {
  const { options, rest } = splitFileUploadProps(props)
  const { className, children, ...divProps } = rest
  const state = useFileUpload(options)
  const hintId = React.useId()
  const [hasHint, setHasHint] = React.useState(false)
  const context: FileUploadContextValue = {
    ...state,
    hintId,
    hasHint,
    setHasHint,
  }

  return (
    <FileUploadContext.Provider value={context}>
      <div
        data-slot="file-upload"
        data-disabled={state.disabled ? "" : undefined}
        data-uploading={state.isUploading ? "" : undefined}
        className={cn("flex w-full min-w-0 flex-col gap-3", className)}
        {...divProps}
      >
        {children}
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {state.announcement}
        </span>
      </div>
    </FileUploadContext.Provider>
  )
}

const fileUploadDropzoneVariants = cva(
  "group/file-upload-dropzone relative flex w-full min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-input bg-card px-6 py-8 text-center text-sm text-card-foreground transition-colors outline-none hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-dragging:border-primary data-dragging:bg-primary/5 data-rejecting:border-destructive data-rejecting:bg-destructive/5 motion-reduce:transition-none data-disabled:pointer-events-none data-disabled:opacity-50"
)

function FileUploadDropzone({
  className,
  children,
  "aria-label":
    ariaLabel = "Upload files. Drag and drop files here or press to browse.",
  ...props
}: Omit<React.ComponentProps<"div">, "ref">) {
  const context = useFileUploadContext()
  const rootProps = context.getRootProps({
    ...props,
    role: "button",
    "aria-label": ariaLabel,
    "aria-describedby": context.hasHint ? context.hintId : undefined,
    "aria-disabled": context.disabled || undefined,
  })

  // The input sits beside the role="button" root so it isn't a focusable
  // descendant of an interactive element; react-dropzone reaches it by ref.
  return (
    <>
      <FileUploadInput />
      <div
        {...rootProps}
        data-slot="file-upload-dropzone"
        data-dragging={context.isDragActive ? "" : undefined}
        data-rejecting={context.isDragReject ? "" : undefined}
        data-disabled={context.disabled ? "" : undefined}
        className={cn(fileUploadDropzoneVariants(), className)}
      >
        {children ?? (
          <>
            <FileUploadDropzoneIcon />
            <FileUploadDropzoneTitle />
            {context.constraints ? (
              <FileUploadDescription>
                {context.constraints}
              </FileUploadDescription>
            ) : null}
          </>
        )}
      </div>
    </>
  )
}

/** The hidden file input. The dropzone renders one; render it yourself in layouts without a dropzone so `open()` works. */
function FileUploadInput(props: DropzoneInputProps) {
  const { getInputProps } = useFileUploadContext()
  return (
    <input
      data-slot="file-upload-input"
      {...getInputProps({ "aria-hidden": true, tabIndex: -1, ...props })}
    />
  )
}

function FileUploadDropzoneIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="file-upload-dropzone-icon"
      aria-hidden="true"
      className={cn(
        "flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-data-dragging/file-upload-dropzone:bg-primary/10 group-data-dragging/file-upload-dropzone:text-primary group-data-rejecting/file-upload-dropzone:bg-destructive/10 group-data-rejecting/file-upload-dropzone:text-destructive motion-reduce:transition-none [&_svg:not([class*='size-'])]:size-6",
        className
      )}
      {...props}
    >
      {children ?? <CloudUploadIcon />}
    </div>
  )
}

function FileUploadDropzoneTitle({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const { isDragActive, isDragReject } = useFileUploadContext()
  return (
    <p
      data-slot="file-upload-dropzone-title"
      className={cn("font-medium text-foreground", className)}
      {...props}
    >
      {children ??
        (isDragReject ? (
          "Some of these files can't be added"
        ) : isDragActive ? (
          "Drop to add files"
        ) : (
          <>
            Drag and drop files here or{" "}
            <span className="text-primary underline-offset-4 group-hover/file-upload-dropzone:underline">
              browse
            </span>
          </>
        ))}
    </p>
  )
}

function FileUploadDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  const { hintId, setHasHint } = useFileUploadContext()
  React.useLayoutEffect(() => {
    setHasHint(true)
    return () => setHasHint(false)
  }, [setHasHint])
  return (
    <p
      id={hintId}
      data-slot="file-upload-description"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function FileUploadHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="file-upload-header"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  )
}

function composeClick(
  own: () => void,
  onClick: React.ComponentProps<typeof Button>["onClick"]
): React.ComponentProps<typeof Button>["onClick"] {
  return (event) => {
    onClick?.(event)
    if (!event.defaultPrevented) own()
  }
}

function FileUploadTrigger({
  children = "Choose",
  onClick,
  disabled,
  ...props
}: React.ComponentProps<typeof Button>) {
  const context = useFileUploadContext()
  return (
    <Button
      data-slot="file-upload-trigger"
      disabled={disabled ?? context.disabled}
      onClick={composeClick(context.open, onClick)}
      {...props}
    >
      <PlusIcon data-icon="inline-start" aria-hidden="true" />
      {children}
    </Button>
  )
}

function FileUploadUploadButton({
  children = "Upload",
  onClick,
  disabled,
  variant = "secondary",
  ...props
}: React.ComponentProps<typeof Button>) {
  const context = useFileUploadContext()
  const hasPending = context.files.some((item) => item.status === "pending")
  return (
    <Button
      data-slot="file-upload-upload-button"
      variant={variant}
      disabled={
        disabled ?? (context.disabled || !context.canUpload || !hasPending)
      }
      onClick={composeClick(context.upload, onClick)}
      {...props}
    >
      <UploadIcon data-icon="inline-start" aria-hidden="true" />
      {children}
    </Button>
  )
}

function FileUploadClearButton({
  children = "Clear",
  onClick,
  disabled,
  variant = "ghost",
  ...props
}: React.ComponentProps<typeof Button>) {
  const context = useFileUploadContext()
  const isEmpty = context.files.length === 0 && context.rejections.length === 0
  return (
    <Button
      data-slot="file-upload-clear-button"
      variant={variant}
      disabled={disabled ?? (context.disabled || isEmpty)}
      onClick={composeClick(context.clear, onClick)}
      {...props}
    >
      <XIcon data-icon="inline-start" aria-hidden="true" />
      {children}
    </Button>
  )
}

function FileUploadTotalProgress({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Progress>, "value">) {
  const { isUploading, totalProgress } = useFileUploadContext()
  if (!isUploading) return null
  return (
    <Progress
      data-slot="file-upload-total-progress"
      value={totalProgress}
      aria-label="Total upload progress"
      className={cn(
        "*:data-[slot=progress-track]:h-1.5 **:data-[slot=progress-indicator]:motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

type FileUploadRenderItem = (
  item: FileUploadItem,
  state: FileUploadContextValue
) => React.ReactNode

function FileUploadList({
  className,
  children,
  renderItem,
  ...props
}: React.ComponentProps<"ul"> & { renderItem?: FileUploadRenderItem }) {
  const context = useFileUploadContext()
  if (context.files.length === 0) return null
  return (
    <ul
      data-slot="file-upload-list"
      aria-label="Selected files"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    >
      {children ??
        context.files.map((item) => (
          <li key={item.id} className="min-w-0">
            {renderItem ? (
              renderItem(item, context)
            ) : (
              <FileUploadItem item={item} />
            )}
          </li>
        ))}
    </ul>
  )
}

const attachmentStateByStatus = {
  pending: "idle",
  queued: "uploading",
  uploading: "uploading",
  done: "done",
  error: "error",
  cancelled: "idle",
} as const satisfies Record<
  FileUploadStatus,
  React.ComponentProps<typeof Attachment>["state"]
>

function describeItem(item: FileUploadItem) {
  const size = formatBytes(item.file.size)
  switch (item.status) {
    case "queued":
      return `${size} · Waiting`
    case "uploading":
      return `${item.progress}% · ${formatBytes(item.loaded)} of ${formatBytes(item.total)}`
    case "done":
      return `${size} · Uploaded`
    case "error":
      return item.error ?? "Upload failed."
    case "cancelled":
      return `${size} · Cancelled`
    default:
      return size
  }
}

function FileUploadItemIcon({ file }: { file: File }) {
  if (file.type.startsWith("image/")) return <ImageIcon aria-hidden="true" />
  if (file.type.startsWith("text/") || file.type === "application/pdf") {
    return <FileTextIcon aria-hidden="true" />
  }
  return <FileIcon aria-hidden="true" />
}

function FileUploadItem({
  item,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Attachment>, "state"> & {
  item: FileUploadItem
}) {
  const context = useFileUploadContext()
  const name = item.file.name
  const busy = item.status === "queued" || item.status === "uploading"

  return (
    <Attachment
      data-slot="file-upload-item"
      data-status={item.status}
      state={attachmentStateByStatus[item.status]}
      className={cn("w-full max-w-none", className)}
      {...props}
    >
      {children ?? (
        <>
          <AttachmentMedia variant={item.previewUrl ? "image" : "icon"}>
            {item.previewUrl ? (
              <img src={item.previewUrl} alt="" />
            ) : (
              <FileUploadItemIcon file={item.file} />
            )}
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle title={name}>{name}</AttachmentTitle>
            <AttachmentDescription>{describeItem(item)}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            {busy ? (
              <AttachmentAction
                aria-label={`Cancel upload of ${name}`}
                onClick={() => context.cancel(item.id)}
              >
                <XIcon aria-hidden="true" />
              </AttachmentAction>
            ) : null}
            {item.status === "error" || item.status === "cancelled" ? (
              <AttachmentAction
                aria-label={`Retry upload of ${name}`}
                onClick={() => context.retry(item.id)}
                disabled={context.disabled}
              >
                <RotateCcwIcon aria-hidden="true" />
              </AttachmentAction>
            ) : null}
            {!busy ? (
              <AttachmentAction
                aria-label={`Remove ${name}`}
                onClick={() => context.remove(item.id)}
                disabled={context.disabled}
              >
                <Trash2Icon aria-hidden="true" />
              </AttachmentAction>
            ) : null}
          </AttachmentActions>
          {busy ? <FileUploadItemProgress item={item} /> : null}
        </>
      )}
    </Attachment>
  )
}

function FileUploadItemProgress({
  item,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Progress>, "value"> & {
  item: FileUploadItem
}) {
  return (
    <Progress
      data-slot="file-upload-item-progress"
      value={item.status === "queued" ? 0 : item.progress}
      aria-label={`Uploading ${item.file.name}`}
      className={cn(
        "basis-full *:data-[slot=progress-track]:h-1 **:data-[slot=progress-indicator]:motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function FileUploadEmpty({ className, ...props }: React.ComponentProps<"div">) {
  const { files } = useFileUploadContext()
  if (files.length > 0) return null
  return (
    <div
      data-slot="file-upload-empty"
      className={cn("text-center text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function FileUploadRejections({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { rejections, dismissRejection } = useFileUploadContext()
  if (rejections.length === 0) return null
  return (
    <div
      data-slot="file-upload-rejections"
      role="alert"
      className={cn(
        "rounded-2xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive",
        className
      )}
      {...props}
    >
      <ul className="flex flex-col gap-1">
        {rejections.map((rejection) => (
          <li key={rejection.id} className="flex items-start gap-2">
            <span className="min-w-0 flex-1">
              {rejection.errors.map((error) => error.message).join(" ")}
            </span>
            <button
              type="button"
              aria-label={`Dismiss message about ${rejection.file.name}`}
              onClick={() => dismissRejection(rejection.id)}
              className="-mr-1 rounded-md p-0.5 text-destructive/80 outline-none hover:text-destructive focus-visible:ring-3 focus-visible:ring-destructive/20"
            >
              <XIcon className="size-3.5" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

type FileUploadAdvancedProps = FileUploadProps & {
  renderItem?: FileUploadRenderItem
  /** Shown under the dropzone when the list is empty. */
  empty?: React.ReactNode
  /** Dropzone content; defaults to an icon, a title and the file constraints. */
  dropzone?: React.ReactNode
  chooseLabel?: React.ReactNode
  uploadLabel?: React.ReactNode
  clearLabel?: React.ReactNode
}

/** The full PrimeReact-style layout: buttons, dropzone, messages, progress and file list. */
function FileUploadAdvanced({
  renderItem,
  empty,
  dropzone,
  chooseLabel,
  uploadLabel,
  clearLabel,
  ...props
}: FileUploadAdvancedProps) {
  const showUpload = Boolean(props.uploader || props.url) && !props.auto
  return (
    <FileUpload data-variant="advanced" {...props}>
      <FileUploadHeader>
        <FileUploadTrigger>{chooseLabel}</FileUploadTrigger>
        {showUpload ? (
          <FileUploadUploadButton>{uploadLabel}</FileUploadUploadButton>
        ) : null}
        <FileUploadClearButton>{clearLabel}</FileUploadClearButton>
      </FileUploadHeader>
      <FileUploadDropzone>{dropzone}</FileUploadDropzone>
      <FileUploadRejections />
      <FileUploadTotalProgress />
      {empty ? <FileUploadEmpty>{empty}</FileUploadEmpty> : null}
      <FileUploadList renderItem={renderItem} />
    </FileUpload>
  )
}

export {
  FileUpload,
  FileUploadAdvanced,
  FileUploadDropzone,
  FileUploadInput,
  FileUploadDropzoneIcon,
  FileUploadDropzoneTitle,
  FileUploadDescription,
  FileUploadHeader,
  FileUploadTrigger,
  FileUploadUploadButton,
  FileUploadClearButton,
  FileUploadTotalProgress,
  FileUploadList,
  FileUploadItem,
  FileUploadItemProgress,
  FileUploadEmpty,
  FileUploadRejections,
  useFileUpload,
  useFileUploadContext,
  formatBytes,
  xhrUpload,
}
export type {
  FileUploadAdvancedProps,
  FileUploadItem as FileUploadItemData,
  FileUploadMessages,
  FileUploadOptions,
  FileUploadProgressHandler,
  FileUploadProps,
  FileUploadRejection,
  FileUploadRenderItem,
  FileUploadState,
  FileUploadStatus,
  FileUploader,
}
