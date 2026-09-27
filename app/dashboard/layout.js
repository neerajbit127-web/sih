export const metadata = {
  title: "Citizen Dashboard | Jan Samadhaan Setu",
  description: "Track your reported public problems, view civic resolution progress, and provide feedback on Jan Samadhaan Setu.",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#F2EFE6] text-[#1A1A1A]">
      {children}
    </div>
  );
}
