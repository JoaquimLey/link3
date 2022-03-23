import { useEffect, useMemo, useRef, useState } from "react";
import { useNear } from "../../context/near"
import { Link } from "../../near/types";
import { useForm } from 'react-hook-form'


const defaultLink: Link = {
  title: "",
  description: "",
  uri: "",
  image_uri: null,
}

const LinkForm = () => {
  const { addLink, isLoggedIn, accountId } = useNear()
  const [link, setLink] = useState<Link | null>(null)
  const [title, setTitle] = useState<string | null>(null)
  const [description, setDescription] = useState<string | null>(null)
  const [uri, setUri] = useState<string | null>(null)
  const [image_uri, setImageUri] = useState<string | null>(null)
  const [tempImg, setTempImg] = useState<File | null>(null)
  const [tempImgUrl, setTempImgUrl] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean>(false)

  const inputImage = useRef<HTMLInputElement>(null);


  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm()

  const onSubmit = handleSubmit((data) => {
    console.log("onSubmit: ", data)
    if (tempImg) {
      console.log("image", tempImg)
      uploadToServer(tempImg)
    }

  });

  const uploadToServer = async (image: File) => {
    const body = new FormData();
    body.append("file", image);
    console.log("image", image)
    const response = await fetch("/api/file", {
      method: "POST",
      body
    });
  };


  // const onSubmit = async (event: any) => {
  //   event.preventDefault()
  //   console.log(event)
  //   console.log("link", link)
  //   if (isLoggedIn && accountId && link
  //     && isValid) {
  //     const result = await addLink({ title, description, uri, image_uri });
  //     console.log("result", result);
  //   }
  // }

  const dropHandler = (event: any) => {
    console.log("dropHandler", event)
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    console.log("file", file)
    if (file) {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = (event: any) => {
        console.log("reader.onload", event.target.result)
        setTempImg(event.target.result)
      }
      setTempImgUrl(URL.createObjectURL(file))
    }
  }
  const pickImage = (event: any) => {
    if (inputImage && inputImage.current) {
      inputImage.current.click()
    }
    event.preventDefault()
  }
  const dragOverHandler = (event: any) => {
    console.log("dragOverHandler", event)
    event.preventDefault()
  }
  const addFile = (event: any) => {
    console.log("addFile", event)

    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setTempImg(file)
      setTempImgUrl(URL.createObjectURL(file))
    } else {
      console.error("no file selected");
    }
    event.preventDefault()
  }





  return (
    <form
      className=" flex flex-col space-y-4 px-8 py-4 rounded max-w-2xl w-full bg-surface"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col space-y-1">
        <div className="flex justify-between items-center">
          <label
            className="label"
            htmlFor="uri">
            URL
          </label>
          {errors.uri && (
            <span className="label-error">{errors.uri.message}</span>
          )}
        </div>
        <input
          className='input input-text'
          id="uri"
          type="link"
          placeholder="https://www.google.com"
          {...register('uri', {
            required: { value: true, message: 'Uri is required' },
            minLength: {
              value: 3,
              message: 'Uri cannot be less than 3 character',
            },
          })}
          onChange={(event) => setUri(event.target.value)}
        />
      </div>

      <div className="flex flex-col space-y-1">
        <div className="flex justify-between items-center">
          <label
            className="label"
            htmlFor="title">Title</label>
          {errors.title && (
            <span className="error-label">{errors.title.message}</span>
          )}
        </div>
        <input
          className='input input-text'
          id="title"
          type="text"
          placeholder="Google"
          {...register('title', {
            required: { value: true, message: 'Title is required' },
            minLength: {
              value: 3,
              message: 'Title cannot be less than 3 character',
            },
          })}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className="flex flex-col space-y-1">
        <div className="flex justify-between items-center">
          <label
            className="label"
            htmlFor="description">Description</label>
          {errors.description && (
            <span className="error-label">{errors.description.message}</span>
          )}
        </div>
        <input
          className='input input-text'
          id="description"
          type="text"
          placeholder="Search Engine"
          {...register('description', {
            required: { value: true, message: 'Description is required' },
            minLength: {
              value: 3,
              message: 'Description cannot be less than 3 character',
            },
          })}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label
          className="label"
          htmlFor="image_uri">Image URL</label>
        <input
          className='input input-text'
          id="image_uri"
          name="image_uri"
          type="link"
          placeholder="https://picsum.photos/250"
          onChange={(event) => setImageUri(event.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="label"> image </label>
        <div
          id="drop_zone"
          onDrop={dropHandler}
          onDragOver={dragOverHandler}
          onClick={pickImage}
          className="
            flex
            justify-center
            items-center
            clickable
            text-on-surface
            h-56
          "
        >
          {tempImgUrl ? (
            <img className="h-full object-cover object-center " src={tempImgUrl} alt="image" />
          ) : (
            <span className="text-on-surface"> Drag and drop image here </span>
          )}
        </div>
        <input
          accept="image/*"
          className="hidden"
          type="file"
          ref={inputImage}
          onChange={addFile}
        />
      </div>

      <button type="submit">
        <p>Create</p>
      </button>
    </form>
  )
}

export default LinkForm