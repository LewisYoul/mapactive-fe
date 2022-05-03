type BadgeProps = {
  className: string;
  children: React.ReactNode
}

export default function Badge(props: BadgeProps) {
  const { className, children } = props;

  return(
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>{children}</span>
  )
}
