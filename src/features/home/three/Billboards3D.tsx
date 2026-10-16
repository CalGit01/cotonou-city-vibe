import { useTranslation } from "react-i18next"
import { Billboard3D, type BoardTheme } from "./Billboard3D"

const CYAN: BoardTheme = {
  from: "#22b8c8",
  to: "#1495a8",
  border: "#111417",
  text: "#ffffff",
}

const MEGA: BoardTheme = {
  from: "#7b2ff7",
  to: "#e0218a",
  border: "#111417",
  text: "#ffffff",
  band: { color: "#f7d13a", text: "MEGA SCREEN" },
}

export function Billboards3D() {
  const { t } = useTranslation()

  const adTitle = t("home.adTitle")
  const adPrice = t("home.adPrice")
  const adUrl = t("home.adUrl")
  const adCta = t("home.adCta")
  const adMega = t("home.adMega")

  return (
    <group>
      <Billboard3D x={-118} z={-14} rotationY={0.5} lines={[adTitle, adPrice]} theme={CYAN} />
      <Billboard3D x={-121} z={8} rotationY={0.4} lines={[adUrl]} theme={CYAN} />
      <Billboard3D x={-117} z={32} rotationY={0.55} lines={[adCta]} theme={CYAN} />

      <Billboard3D x={116} z={-14} rotationY={-0.5} lines={[adTitle, adUrl]} theme={CYAN} />
      <Billboard3D x={121} z={8} rotationY={-0.4} lines={[adPrice]} theme={CYAN} />
      <Billboard3D x={117} z={32} rotationY={-0.55} lines={[adCta]} theme={CYAN} />

      <Billboard3D
        x={136}
        z={-30}
        rotationY={-0.6}
        width={17}
        height={8.5}
        lines={[adMega]}
        theme={{ ...MEGA, band: { color: "#f7d13a", text: adMega } }}
        mega
      />
      <Billboard3D
        x={-136}
        z={-30}
        rotationY={0.6}
        width={17}
        height={8.5}
        lines={[adMega]}
        theme={{ ...MEGA, band: { color: "#f7d13a", text: adMega } }}
        mega
      />
      <Billboard3D
        x={30}
        z={-47}
        rotationY={-0.15}
        width={17}
        height={8.5}
        lines={[adMega]}
        theme={{ ...MEGA, band: { color: "#f7d13a", text: adMega } }}
        mega
      />
    </group>
  )
}
