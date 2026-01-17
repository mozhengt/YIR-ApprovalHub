import * as React from "react"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

type CheckedState = boolean | "indeterminate"

export interface CheckboxProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        "type" | "checked" | "defaultChecked" | "onChange"
    > {
    checked?: CheckedState
    defaultChecked?: CheckedState
    onCheckedChange?: (state: CheckedState) => void
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    (
        {
            className,
            checked,
            defaultChecked = false,
            disabled,
            onCheckedChange,
            onChange,
            ...props
        },
        ref
    ) => {
        const [uncontrolledChecked, setUncontrolledChecked] = React.useState<CheckedState>(
            defaultChecked
        )
        const isControlled = typeof checked !== "undefined"
        const currentState = isControlled ? checked : uncontrolledChecked
        const inputRef = React.useRef<HTMLInputElement | null>(null)

        const setRefs = React.useCallback(
            (node: HTMLInputElement | null) => {
                inputRef.current = node
                if (typeof ref === "function") {
                    ref(node)
                } else if (ref) {
                    ref.current = node
                }
            },
            [ref]
        )

        React.useEffect(() => {
            if (inputRef.current) {
                inputRef.current.indeterminate = currentState === "indeterminate"
            }
        }, [currentState])

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const nextState: CheckedState = event.target.indeterminate
                ? "indeterminate"
                : event.target.checked

            if (!isControlled) {
                setUncontrolledChecked(nextState)
            }

            onCheckedChange?.(nextState)
            onChange?.(event)
        }

        const dataState =
            currentState === "indeterminate"
                ? "indeterminate"
                : currentState
                ? "checked"
                : "unchecked"

        return (
            <span className="inline-flex items-center">
                <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={currentState === "indeterminate" ? false : Boolean(currentState)}
                    disabled={disabled}
                    onChange={handleChange}
                    ref={setRefs}
                    {...props}
                />
                <span
                    aria-hidden="true"
                    data-state={dataState}
                    className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary ring-offset-background transition-colors peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
                        className
                    )}
                >
                    {currentState === "indeterminate" ? (
                        <Minus className="h-3 w-3" />
                    ) : currentState ? (
                        <Check className="h-3 w-3" />
                    ) : null}
                </span>
            </span>
        )
    }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
