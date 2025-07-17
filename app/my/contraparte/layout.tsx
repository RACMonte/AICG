import NavbarC from "./Navabar"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <>
        <NavbarC/>
        </>
        {children}
      </body>
    </html>
  )
}