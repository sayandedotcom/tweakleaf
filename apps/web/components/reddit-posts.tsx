"use client";

import { useEffect } from "react";

const redditPosts = [
  {
    title:
      "This one prompt turned my resume into a job magnet. Google, Meta, and Microsoft approved!",
    url: "https://www.reddit.com/r/ChatGPTPromptGenius/comments/1k2vluo/this_one_prompt_turned_my_resume_into_a_job/",
    username: "u/MaxWell-AI",
    subreddit: "ChatGPTPromptGenius",
  },
  {
    title: "Please don't use AI for cover letters while applying for jobs.",
    url: "https://www.reddit.com/r/recruitinghell/comments/1gq4jly/plz_dont_use_ai_for_cover_letters_while/",
    username: "u/MrBunny64",
    subreddit: "recruitinghell",
  },
  {
    title: "How I write genuinely good cover letters with ChatGPT",
    url: "https://www.reddit.com/r/ChatGPT/comments/1au2qx8/how_i_write_genuinely_good_cover_letters_with/",
    username: "u/satzz10",
    subreddit: "ChatGPT",
  },
  {
    title: "How to humanize AI generated texts",
    url: "https://www.reddit.com/r/ArtificialInteligence/comments/1c0jsa5/how_to_humanize_aigenerated_texts/",
    username: "u/LeoPiano22",
    subreddit: "ArtificialInteligence",
  },
  {
    title: "ChatGPT prompts that helped transform my cover letter",
    url: "https://www.reddit.com/r/ChatGPTPromptGenius/comments/1kz2v63/chatgpt_prompts_that_helped_transform_my_cover/",
    username: "u/ranyelsazam",
    subreddit: "ChatGPTPromptGenius",
  },
  {
    title: "10 prompts I used to fix my resume",
    url: "https://www.reddit.com/r/jobsearchhacks/comments/1mdhwph/10_prompts_i_used_to_fix_my_resume/",
    username: "u/kmac23",
    subreddit: "jobsearchhacks",
  },
];

export function RedditPosts() {
  useEffect(() => {
    // Load Reddit embed script
    const script = document.createElement("script");
    script.src = "https://embed.reddit.com/widgets.js";
    script.async = true;
    script.charset = "UTF-8";
    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {redditPosts.map((post) => (
        <blockquote
          key={post.url}
          className="reddit-embed-bq"
          data-embed-showmedia="false"
          data-embed-theme="dark"
          style={{ height: "500px" }}
          data-embed-created="2025-08-22T04:47:48Z"
        >
          <a href={post.url}>{post.title}</a>
          <br /> by
          <a href={`https://www.reddit.com/user/${post.username}`}>
            {post.username}
          </a>{" "}
          in
          <a href={`https://www.reddit.com/r/${post.subreddit}`}>
            {post.subreddit}
          </a>
        </blockquote>
      ))}
    </div>
  );
}

//     <blockquote
//       className="reddit-embed-bq"
//       data-embed-showmedia="false"
//       data-embed-theme="dark"
//       style={{ height: "500px" }}
//       data-embed-created="2025-08-22T04:47:48Z"
//     >
//       <a href="https://www.reddit.com/r/dataisbeautiful/comments/uul3kh/oc_travel_durations_from_paris_by_train_minute_by/">
//         [OC] Travel durations from Paris by train, minute by minute
//       </a>
//       <br /> by
//       <a href="https://www.reddit.com/user/gmilloue/">u/gmilloue</a> in
//       <a href="https://www.reddit.com/r/dataisbeautiful/">dataisbeautiful</a>
//     </blockquote>
//   );
// }
