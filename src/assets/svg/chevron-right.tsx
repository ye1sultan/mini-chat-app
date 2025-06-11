import * as React from "react";
import { Path, Svg } from "react-native-svg";

function ChevronRight(props: React.ComponentProps<typeof Svg>) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M9 20l8-8-8-8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const MemoChevronRight = React.memo(ChevronRight);
export default MemoChevronRight;
