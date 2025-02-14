


export function Card({icon,title,img,text}){

    return(
        <div className="  w-full h-full rounded-2xl flex flex-col items-center text-white relative">
            <div className="absolute top-0 z-20 h-[70%] w-full flex flex-col justify-start pt-8 items-start bg-gradient-to-b from-40% from-primary-100 to-transparent rounded-2xl p-5">
                <div className=" flex justify-center items-center w-full">
            <h1 className=" text-2xl font-Sora-black text-center justify-center flex flex-row items-center gap-2 mt-2">{icon} {title}</h1>
            </div>
            <h1 className=" font-Outfit text-base text-center mt-3">{text}</h1>
            </div>

            <div className="absolute  bottom-0 w-full h-[80%] z-10 rounded-2xl" style={{background: `url(${img})` , backgroundSize: 'cover' }}></div>
        </div>

    )
}