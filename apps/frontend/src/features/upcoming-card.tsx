import { Badge } from "@/components/ui/badge"
import { IconChartBar, IconWorldWww } from "@tabler/icons-react"

export default function UpcomingCard() {
    const cardDetails = [{
        key: "cD1",
        icon: <IconWorldWww stroke={1} size={28} className="text-secondary-foreground" />,
        label: "Custom Domain",
        label_desc:"Connect your own domain"
    },{
        key: "cD2",
        icon: <IconChartBar stroke={1} size={28} className="text-secondary-foreground" />,
        label: "Analytics",
        label_desc:"Track visits and engagement"
    }]
  return (
      //   Coming Soon Card
      <>
    {cardDetails.map((cardDetail)=>(<div key={cardDetail.key} className="flex w-full lg:items-center items-start justify-between gap-4 rounded-2xl bg-card px-6 py-5 flex-row">
      <div className="flex flex-row items-start justify-center gap-4">
        <div className="flex items-center justify-center rounded-lg bg-border p-2 text-background">
          {cardDetail.icon}
        </div>
        {/* item content  */}
        <div className="flex flex-col items-start justify-center">
          <p className="font-semibold text-sm text-secondary-foreground">{cardDetail.label}</p>
          <p className="text-xs text-muted-foreground">{cardDetail.label_desc}</p>
        </div>
      </div>
      {/* badge  */}
      <Badge>Coming Soon</Badge>
          </div>))}
          </>
  )
}
