
interface Link {
  id: string,
  uri: string,
  title: string,
  description: string,
  image_uri?: string,
}

interface Props {
  link: Link;
}

const LinkTreeItem = ({ link }: Props) => {
  return (
    <div>
      <a href={link.uri} target="_blank">
        <div className='flex gap-x-4 items-center p-4 rounded border border-accent w-full '>
          <img src={link.image_uri ? link.image_uri : "https://picsum.photos/200"} alt={link.title} className='w-10 aspect-square object-cover object-center rounded-full' />
          <div>
            <div>{link.title}</div>
            <div>{link.description}</div>
          </div>
        </div>
      </a>
    </div>
  )
}

export default LinkTreeItem;