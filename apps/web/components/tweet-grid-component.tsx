import { TweetGrid } from "./cult-ui/tweet-grid";

const exampleTweets = [
  "1742983975340327184",
  "1743049700583116812",
  "1754067409366073443",
  "1753968111059861648",
  "1754174981897118136",
  "1743632296802988387",
  "1754110885168021921",
  "1760248682828419497",
  "1760230134601122153",
  "1760184980356088267",
];
export default function TweetGridComponent() {
  return (
    <div className="flex justify-center">
      <TweetGrid tweets={exampleTweets} />
    </div>
  );
}
