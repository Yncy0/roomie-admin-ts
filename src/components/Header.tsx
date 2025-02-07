import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import { fetchProfilesSingle } from "@/hooks/queries/profiles/useFetchProfiles";

export default function HeaderComponent() {
  const { data } = fetchProfilesSingle();

  return (
    <>
      <header className="header-div bg-white">
        <div className="flex flex-row items-center gap-8 ml-auto">
          <FontAwesomeIcon icon={faBell} />
          <FontAwesomeIcon icon={faUser} />
          <p id="user-name">Hello! {data?.username}</p>
        </div>
      </header>
    </>
  );
}
