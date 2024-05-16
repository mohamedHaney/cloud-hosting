import { getSingleArticle } from "@/apiCalls/ArticleApiCall";
import CommentItem from "@/components/comments/CommentItem";
import AddCommentForm from "@/components/comments/AddCommentForm";
import { SingleArticle } from "@/utils/types";
import { Metadata } from "next";
import {cookies} from "next/headers"
import { verifyTokenForpage } from "@/utils/verifiyToken";
interface SingleArticlePageProps {
  params: { id: string };
}

const SingleArticlePage = async({params}: SingleArticlePageProps) => {
  const token = cookies().get("jwtToken")?.value||""
  const payload = verifyTokenForpage(token)
  const article : SingleArticle = await getSingleArticle(params.id);
  return (
    <section className="fix-height container m-auto w-full px-5 pt-8 md:w-3/4">
      <div className="bg-white p-7 rounded-lg mb-7">
        <h1 className="text-3xl font-bold text-gray-700 mb-2">
          {article.title}
        </h1>
        <div className="text-gray-800 text-xl mt-5">{new Date(article.createdAt).toDateString()}</div>
        <p>{article.description}</p>
      </div>
      <div className="mt-7 ">
        {payload ? (
          <AddCommentForm articleId={article.id } />
        ):(
          <p className="text-blue-600 md:text-xl">
            to write comment you should login first
          </p>
        )
        
        }
      </div>
      <h4 className="text-xl text-gray-800 ps-1 font-semibold mb-2 mt-7">
        Commetns
      </h4>
        {article.comments.map(comment=>(
          <CommentItem key={comment.id} comment={comment} userId={payload?.id } />
        ))}
    </section>
  );
};

export default SingleArticlePage;
export const metadata: Metadata = {
  title: "Articles Page",
  description: "Articles About Programming",
};
