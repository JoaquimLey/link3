import LinkTree from "./link_tree";
import { Link , Hub} from "../../near/types";
import { useMemo, useState } from "react";
import { useNear } from "../../context/near";


const HubDefault: Hub = {
  title: "",
  description: "",
  links: [],
}


const Hub = () => {

  const { getHub, isLoggedIn, accountId } = useNear()
  const [hub, setHub] = useState<Hub | null>(null)

  useMemo(async () => {
    if (isLoggedIn && accountId) {
      const result = await getHub(accountId);
      if (result) {
        setHub(result);
      }
      return hub
    }
  }, [accountId, isLoggedIn])

  if (hub) {
    return (
      <>
        <div className="p-6 border border-accent rounded space-y-4 flex flex-col max-w-2xl w-full  items-center justify-center">

          <img src={hub.image_uri ? hub.image_uri : "https://picsum.photos/200"} alt={hub.title}
            className="w-40 aspect-square object-cover object-center rounded-full" />
          <div className="text-xl font-bold tracking-wider">
            {hub.title}
          </div>
          <LinkTree links={hub.links} />
        </div>
      </>
    )
  }
  return (
    <>
      <div>Sooning</div>
    </>
  )
}
export default Hub;