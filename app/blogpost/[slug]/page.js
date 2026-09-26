export default async function Page({ params }) {
  const { slug } = await params
  let languages = ["python","C#","C"]
  if(languages.includes(slug)){
    return <div>My post:{slug}</div>
  }
  else{
    return <div>Post not Found</div>
  }
  return <div>My Post: {slug}</div>
}