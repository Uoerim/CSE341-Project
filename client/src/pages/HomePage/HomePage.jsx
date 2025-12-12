import "./HomePage.css";
import MainNav from "../../components/Main/MainNav";
import MainSidePanel from "../../components/Main/MainSidePanel";
import Post from "../../components/Main/Post/Post";
import { dummyPosts } from "../../utils/dummyPosts";

function HomePage() {
  return (
    <div className="home-root">
      <MainNav />
      <main className="home-layout">
        <section className="home-feed">
          {dummyPosts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </section>
        <MainSidePanel />
      </main>
    </div>
  );
}

export default HomePage;
