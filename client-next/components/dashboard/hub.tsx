import { useMemo, useState } from "react";
import useSWR, { Key, Fetcher } from 'swr'
import getHub from "../../api/getHub";
import { useNear } from "../../context/near";
import LinkTree from "./link_tree";

interface Link {
  id: string,
  uri: string,
  title: string,
  description: string,
  image_uri?: string,
}

interface Hub {
  title: string,
  description: string,
  image_uri?: string,
  links: Array<Link>;
}

const HubDefault: Hub = {
  title: "",
  description: "",
  links: [],
}


const Hub = () => {

  const { view, getHub, isLoggedIn, accountId } = useNear()
  const [hub, setHub] = useState<Hub | null>(null)

  useMemo(async () => {
    if (isLoggedIn && accountId) {

      const result = await getHub(accountId);
      if (result) {
        const cenas = {
          title: result.title ? result.title : "",
        }
        setHub(result);
      }
      return hub
    }
  }, [accountId, isLoggedIn])

  //GET FROM API
  // useMemo(async () => {
  //   if (isLoggedIn && accountId) {
  //     setHub(await getHub(accountId));
  //     return hub
  //   }
  // }, [accountId, isLoggedIn])

  // GET WITH VIEW
  // useMemo(async () => {
  //   if (isLoggedIn && accountId) {

  //     const result = await view("get", { account_id: accountId });
  //     if (result) {
  //       const cenas = {
  //         title: result.title ? result.title : "",
  //       }
  //       setHub(result);
  //     }
  //     return hub
  //   }
  // }, [accountId, isLoggedIn])

  if (hub) {
    console.log("hub", hub)
    return (
      <>
        <div className="p-6 border border-accent rounded space-y-4 flex flex-col  items-center justify-center">

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