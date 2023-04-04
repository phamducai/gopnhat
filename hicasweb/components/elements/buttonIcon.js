const ButtonIcon = ({
  icon,
  text,
  className,
  isIconLeft = true,
  onClick,
  loading,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={`${className} w-full h-full text-[1.125rem] px-3 flex items-center justify-center gap-x-1`}
    >
      {isIconLeft && icon}
      <span className="mt-[-1px]">{text}</span>
      {!isIconLeft && icon}
    </button>
  )
}
export default ButtonIcon
