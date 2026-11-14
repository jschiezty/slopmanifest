import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"The Slopcore Manifesto",description:"An open manifesto in defense of more. Read the principles and contribute to the shared document.", icons:{icon:"/favicon.svg"}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
