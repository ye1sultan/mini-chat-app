import * as React from "react";
import Svg, { Path } from "react-native-svg";

function DoubleCheck(props: React.ComponentProps<typeof Svg>) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M16.552 7L7.448 18 3.31 13"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.69 7l-9.104 11-4.138-5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const MemoDoubleCheck = React.memo(DoubleCheck);
export default MemoDoubleCheck;
