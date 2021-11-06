import { connect } from "react-redux";
import { setSearchVisibility } from "../../store/actions";
import { IState } from "../../store/models";
import "./Header.css";
import { CgPlayListSearch } from "react-icons/cg";

const Header = ({ searchIsVisible, setSearchVisibility }: any) => {

  return (
    <div className="header__container">
      <span>Peru</span>
    </div>
  );
};


export default Header;
