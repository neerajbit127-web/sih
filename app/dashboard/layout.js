export const metadata = {
  title: "Stakeholder Dashboards | Jan Samadhaan Setu",
  description: "Civic innovation and governance portal for students, faculties, universities, citizens, municipal governments, and companies.",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#F2EFE6] text-[#1A1A1A]">
      {children}
    </div>
  );
}
