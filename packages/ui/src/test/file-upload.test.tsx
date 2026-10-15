import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { FileUpload, FileUploadDropzone } from "../components/file-upload"

afterEach(cleanup)

describe("FileUpload", () => {
  it("renders a dropzone", () => {
    render(
      <FileUpload>
        <FileUploadDropzone />
      </FileUpload>
    )

    expect(
      screen.getByRole("button", {
        name: "Upload files. Drag and drop files here or press to browse.",
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/browse/i)).toBeInTheDocument()
  })
})
