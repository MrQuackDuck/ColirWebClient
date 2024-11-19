function HeaderTab({ children }) {
  return (
    <div className="flex pl-8 py-2 select-none items-center text-nowrap text-popover-foreground text-sm whitespace-nowrap rounded-md font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-ellipsis h-9">
      {children}
  </div>
  )
}

export default HeaderTab