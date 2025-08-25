import NewsContents from "@/modules/news/ui/views/news-contents";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "最新消息",
};

const NewsPage = () => {
  return (
    <div className="">
      <NewsContents />
    </div>
  );
};

export default NewsPage;
