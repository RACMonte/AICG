import NavbarP from "./Navabar"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <>
        <NavbarP/>
        </>
        {children}
      </body>
    </html>
  )
}