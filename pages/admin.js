import React from "react";
import Layout from "components/Layout";
import useUser from "lib/useUser";

export default function Admin() {
  const { user } = useUser({
    adminOnly: true,
    redirectTo: "/",
  });
  const { events } = useEvents(user);

  return (
    <Layout>
      <h1>TrackTask Admin Panel</h1>
      <h2>
        You shouldn't be here...
      </h2>
      {user && (
        <>
          <p style={{ fontStyle: "italic" }}>
            Your user info, pulled from the TrackTask API.
          </p>

          <pre>{JSON.stringify(user, null, 2)}</pre>
        </>
      )}
    </Layout>
  );
}
