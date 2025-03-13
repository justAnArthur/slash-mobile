import { useButtonStyles } from "@/components/ui/ThemedButton"
import { Link, type LinkProps } from "expo-router"

export const ThemedLink = ({
  style,
  defaultStyles,
  ...props
}: LinkProps & { defaultStyles?: boolean }) => {
  const buttonStyles = useButtonStyles()

  return (
    <Link {...props} style={[!defaultStyles && buttonStyles.button, style]}>
      {props.children}
    </Link>
  )
}
