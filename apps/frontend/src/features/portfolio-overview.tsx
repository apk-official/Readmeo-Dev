import OverviewCard from "./overview-card";
import UpcomingCard from "./upcoming-card";


export default function PortfolioOverview() {
  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-6 p-5">
      <section className="flex flex-col items-start justify-center">
        <p className="text-sm text-muted-foreground">Overview</p>
        <h2 className="text-xl font-medium sm:text-3xl">
          Your Readme & Portfolio
        </h2>
      </section>
      <section className="w-full flex flex-col gap-4">
        <OverviewCard />
        <p className="font-medium text-xs text-muted-foreground">UP NEXT</p>
        <UpcomingCard/>
      </section>
    </div>
  )
}
