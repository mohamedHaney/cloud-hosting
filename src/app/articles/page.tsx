import ArticleItem from "@/components/articles/ArticleItem";
import Pagination from "@/components/articles/Pgination";
import SearchArticleInput from "@/components/articles/SearchArticleInput";
import {Article} from "@prisma/client"
import { getArticles  } from "@/apiCalls/ArticleApiCall";
import { ARTICLE_PER_PAGE } from "@/utils/constants";
import prisma from "@/utils/db";
interface ArticlePageProps{
  searchParams:{pageNumber:string}
}

const Articles = async ({searchParams}:ArticlePageProps) => {
  const {pageNumber} = searchParams
  const articles: Article[] = await getArticles(pageNumber);
  const count:number = await prisma.article.count()
  const pages = Math.ceil(count / ARTICLE_PER_PAGE)
  return (
    <section className="container m-auto px-5">
      <SearchArticleInput/>
      <div className="flex items-center justify-center flex-wrap gap-7">
      {articles.map((item) => (
      <ArticleItem key={item.id} article={item}/>
      ))}
      </div>
      <Pagination pageNumber={parseInt(pageNumber)} route="/articles" pages={ pages }/>
    </section>
  );
};

export default Articles;
  