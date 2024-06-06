import { Link } from "react-router-dom"


const NotFoundPage = () => {
  return (
    <div className="flex flex-col gap-2">
      <div>404 not found</div>
      <Link to="/">Home</Link>
    </div>
  );
}

export default NotFoundPage