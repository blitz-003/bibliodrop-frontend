import { cn } from "@/lib/cn";

/*
 * Form field primitives.
 *
 * The codebase contained four different focus strategies across form
 * controls — `focus:ring-2 focus:ring-blue-500` on the browse filters,
 * `focus:outline-none` (no replacement) on the book review rating, and
 * `focus:outline-indigo-500` on the admin role select, which sets a colour
 * *without* suppressing the default ring and so renders two overlapping focus
 * indicators. All controls now share one ring.
 *
 * Every control is also forced to render an id so `Field` can associate its
 * label. Roughly fifteen inputs across the app previously had a visible label
 * with no `htmlFor`/`id` pair, or relied on a placeholder as the only label.
 *
 * `icon` is destructured by every control and handed to `Field`, which renders it
 * inside the label. Without that, an `icon` passed to one of these controls fell
 * through `...props` and landed on the raw `<input>`, emitting an invalid
 * `icon="[object Object]"` attribute and drawing nothing.
 */

const CONTROL_BASE =
  "w-full rounded-control border border-border bg-surface text-content " +
  "transition-colors placeholder:text-gray-400 " +
  "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 " +
  "disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-60";

export const CONTROL_CLASS = CONTROL_BASE;

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  icon: Icon,
  className,
  children,
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="flex items-center gap-1.5 text-sm font-semibold text-content"
        >
          {Icon && (
            <Icon aria-hidden="true" className="h-4 w-4 text-content-subtle" />
          )}
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-danger">
              *
            </span>
          )}
        </label>
      )}

      {children}

      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="text-xs text-content-subtle">
          {hint}
        </p>
      )}

      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({ label, hint, error, required, icon, className, id, ...props }) {
  const fieldId = id ?? props.name;

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      icon={icon}
      htmlFor={fieldId}
      className={className}
    >
      <input
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
        }
        className={cn(CONTROL_BASE, "px-4 py-2.5 text-sm")}
        {...props}
      />
    </Field>
  );
}

export function Select({
  label,
  hint,
  error,
  required,
  icon,
  className,
  id,
  children,
  ...props
}) {
  const fieldId = id ?? props.name;

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      icon={icon}
      htmlFor={fieldId}
      className={className}
    >
      <select
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
        }
        className={cn(CONTROL_BASE, "cursor-pointer px-4 py-2.5 text-sm")}
        {...props}
      >
        {children}
      </select>
    </Field>
  );
}

/*
 * Labelled control with a leading icon and a custom chevron, for selects that
 * need to sit inside a `relative` wrapper. The native chevron is suppressed so
 * the custom arrow lines up with the icon gutter.
 */
export function IconSelect({ label, icon: Icon, id, className, children, ...props }) {
  const fieldId = id ?? props.name;

  return (
    <div className={cn("relative", className)}>
      <Icon
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-content-subtle"
      />
      <label htmlFor={fieldId} className="sr-only">
        {label}
      </label>
      <select
        id={fieldId}
        className={cn(CONTROL_BASE, "cursor-pointer py-3 pl-11 pr-10 text-base")}
        {...props}
      >
        {children}
      </select>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 h-0 w-0 -translate-y-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-content-muted"
      />
    </div>
  );
}

export function Textarea({
  label,
  hint,
  error,
  required,
  icon,
  className,
  id,
  ...props
}) {
  const fieldId = id ?? props.name;

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      icon={icon}
      htmlFor={fieldId}
      className={className}
    >
      <textarea
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
        }
        className={cn(CONTROL_BASE, "px-4 py-2.5 text-sm")}
        {...props}
      />
    </Field>
  );
}