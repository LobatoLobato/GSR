import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

import * as Brands from "@fortawesome/free-brands-svg-icons";
import * as Regular from "@fortawesome/free-regular-svg-icons";
import * as Solid from "@fortawesome/free-solid-svg-icons";

type Icon = {
  (props: FontAwesomeIconProps): JSX.Element;
  Brands: typeof Brands;
  Regular: typeof Regular;
  Solid: typeof Solid;
};

export const Icon: Icon = Object.assign(
  (props: FontAwesomeIconProps) => <FontAwesomeIcon {...props} />,
  {
    Brands,
    Regular,
    Solid,
  },
);
export default Icon as Icon;
