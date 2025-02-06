import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function HeaderComponent() {
  return (
    <>
      <header className="header-div bg-white">
        <div className="flex flex-row items-center gap-8 ml-auto">
          <FontAwesomeIcon icon={faBell} />
          <FontAwesomeIcon icon={faUser} />
          <p id="user-name">Hello! User</p>
        </div>
      </header>
    </>
  );
}
