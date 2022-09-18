import React from "react";
import Layout from "components/Layout";
import useUser from "lib/useUser";
import useEvents from "lib/useEvents";

// Make sure to check https://nextjs.org/docs/basic-features/layouts for more info on how to use layouts
export default function Dashboard() {
  const { user } = useUser({
    redirectTo: "/login",
  });
  {/*const { events } = useEvents(user);*/}
  const { tasks } = useTasks(user);
  
  if (!user || !user.isLoggedIn || user.permissions.banned) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }
  return (
    <Layout>
      <h1>Welcome to TrackTask!</h1>
      <h2>
        The shareable task management system.
      </h2>
      <p style={{ fontStyle: "italic" }}>
        Your user info, pulled from the TrackTask API.
      </p>

      <pre>{JSON.stringify(user, null, 2)}</pre>

      {tasks !== undefined && (
        <p>
          Number of tasks: <b>{tasks.length}</b>.{" "}
          {tasks.length > 0 && (
            <>
              A task: <b>{tasks[0]}</b>
            </>
          )}
        </p>
      )}
    </Layout>
  );
}
