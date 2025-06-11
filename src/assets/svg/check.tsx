import * as React from "react";
import { Path, Svg } from "react-native-svg";

function Check(props: React.ComponentProps<typeof Svg>) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 20 24" fill="none" {...props}>
      <Path
        d="M16.667 7L7.5 18l-4.167-5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const MemoCheck = React.memo(Check);
export default MemoCheck;
