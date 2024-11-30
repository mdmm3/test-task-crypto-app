import NavBar from "./NavBar";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div>
      <NavBar />
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
}