import * as React from "react"
import { ThumbsUp, RotateCcw } from "lucide-react"
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@carsxe/design-system/components/bubble"

export function BubbleConversation({ avatars = true }: { avatars?: boolean }) {
  const [feedback, setFeedback] = React.useState("")
  const assistantMessage = "How can I help with this vehicle?"
  const userMessage = "Show its latest valuation."

  return (
    <div className="w-full max-w-xl space-y-3">
      <BubbleGroup className="gap-5">
        <Bubble
          copyText={assistantMessage}
          timestamp={new Date(2026, 8, 15, 3, 14)}
          avatar={
            avatars
              ? {
                  name: "CarsXE Assistant",
                  src: "/favicon-32.png",
                  fallback: "CX",
                }
              : undefined
          }
          actions={[
            {
              icon: <ThumbsUp className="size-4" />,
              name: "Helpful response",
              tooltipLabel: "Mark as helpful",
              onPress: () => setFeedback("Thanks for your feedback."),
            },
          ]}
        >
          <BubbleContent>{assistantMessage}</BubbleContent>
        </Bubble>
        <Bubble
          align="end"
          variant="secondary"
          copyText={userMessage}
          timestamp={new Date(2026, 8, 15, 3, 15)}
          avatar={avatars ? { name: "Alex Morgan" } : undefined}
          actions={[
            {
              icon: <RotateCcw className="size-4" />,
              name: "Send again",
              onPress: () => setFeedback("Message sent again."),
            },
          ]}
        >
          <BubbleContent>{userMessage}</BubbleContent>
        </Bubble>
      </BubbleGroup>
      <p role="status" className="min-h-5 text-sm text-muted-foreground">
        {feedback}
      </p>
    </div>
  )
}

export function BubbleWithoutAvatars() {
  return <BubbleConversation avatars={false} />
}

export function BubbleLegacy() {
  return (
    <BubbleGroup className="w-full max-w-xl gap-5">
      <Bubble>
        <BubbleContent>How can I help with this vehicle?</BubbleContent>
        <BubbleReactions>👍</BubbleReactions>
      </Bubble>
      <Bubble align="end" variant="secondary">
        <BubbleContent>Show its latest valuation.</BubbleContent>
      </Bubble>
    </BubbleGroup>
  )
}
