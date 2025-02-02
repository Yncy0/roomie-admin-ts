import { Outlet } from "@tanstack/react-router";
import Header from './Header';

export default function BodyComponent() {
    return (
        <div className="body-container">
            <Header />
            <Outlet />
        </div>
    );
}