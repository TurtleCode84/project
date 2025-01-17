import React from "react";
import Layout from "components/Layout";
import Loading from "components/Loading";
import User from "components/User";
import Report from "components/Report";
import useUser from "lib/useUser";
import useAdminUsers from "lib/useAdminUsers";
import useAdminReports from "lib/useAdminReports";
import dynamicToggle from "lib/dynamicToggle";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Admin() {
  const { user, mutateUser } = useUser({
    redirectTo: "/dashboard",
    adminOnly: true,
  });
  const router = useRouter();
  const { deleted } = router.query;
  var dynamicMsg;
  if (deleted === "true") {
    dynamicMsg = "User successfully deleted!";
  }
  const { reports, error: reportsError, mutate: reportsMutate } = useAdminReports(user, false);
  const reportList = reports?.slice(0,4).map((report) =>
    <span key={report._id} style={{ float: "left", paddingRight: "12px" }}><Report user={user} report={report} mutate={reportsMutate}/></span>
  );
  const { users: recentlyActive } = useAdminUsers(user, "login", 5);
  const activeUsersList = recentlyActive?.map((activeUser) =>
    <li key={activeUser._id} style={{ margin: "0.5em" }}>
      <User user={user} id={activeUser._id} link={true}/>{activeUser.permissions.admin && <span title="Admin" style={{ color: "slategray" }} className="material-symbols-outlined icon-list">verified_user</span>}{activeUser.permissions.banned && <span title="Banned" style={{ color: "red" }} className="material-symbols-outlined icon-list">block</span>} &bull; Last login {activeUser.history.lastLogin > 0 ? moment.unix(activeUser.history.lastLogin).fromNow() : 'never'}
    </li>
  );
  const { users: recentlyJoined } = useAdminUsers(user, "joined", 5);
  const newUsersList = recentlyJoined?.map((newUser) =>
    <li key={newUser._id} style={{ margin: "0.5em" }}>
      <User user={user} id={newUser._id} link={true}/>{newUser.permissions.admin && <span title="Admin" style={{ color: "slategray" }} className="material-symbols-outlined icon-list">verified_user</span>}{newUser.permissions.banned && <span title="Banned" style={{ color: "red" }} className="material-symbols-outlined icon-list">block</span>} &bull; Joined {newUser.history.joined > 0 ? moment.unix(newUser.history.joined).fromNow() : 'never'}
    </li>
  );

  if (!user || !user.isLoggedIn || user.permissions.banned || !user.permissions.admin) {
    return (
      <Loading/>
    );
  }
  return (
    <Layout>
      <h1>TrackTask Admin Panel <span style={{ color: "slategray" }} className="material-symbols-outlined">verified_user</span></h1>
      {dynamicMsg && <p className="success">{dynamicMsg}{' '}<Link href="/admin">Ok</Link></p>}
      <h2><hr/>Recent Reports<hr/></h2>
      <ul style={{ display: "table" }}>
        {reportList?.length > 0 ? reportList : <li style={{ fontStyle: "italic" }}>No reports found!</li>}
      </ul>
      <h2><hr/>User Statistics<hr/></h2>
      <h3>Recently active:</h3>
      <ul>
        {activeUsersList ? activeUsersList : <li style={{ fontStyle: "italic" }}>Loading active users...</li>}
        {activeUsersList && activeUsersList === null && <li style={{ fontStyle: "italic" }}>No active users found</li>}
      </ul>
      <h3>Recently joined:</h3>
      <ul>
        {newUsersList ? newUsersList : <li style={{ fontStyle: "italic" }}>Loading new users...</li>}
        {newUsersList && newUsersList === null && <li style={{ fontStyle: "italic" }}>No new users found</li>}
      </ul>
      <Link href="/admin/users">View all users</Link><hr/>
      <p>Useful admin pages:</p>
      <ul style={{ listStyle: "revert", margin: "revert" }}>
        <li><Link href="/admin/users/search">Find a user</Link></li>
        <li><Link href="/admin/tasks">View reported tasks</Link></li>
        <li><Link href="/admin/collections">View reported collections</Link></li>
        <li><Link href="/admin/reports">Moderate reports</Link></li>
      </ul>
      <details id="raw">
        <summary onClick={(e) => { dynamicToggle(e, "raw") }}>View my raw session info</summary>
        {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
      </details>
    </Layout>
  );
}
