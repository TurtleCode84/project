import React from "react";
import moment from "moment";
import Layout from "components/Layout";
import Loading from "components/Loading";
import DueDate from "components/DueDate";
import useUser from "lib/useUser";
import useTasks from "lib/useTasks";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { user } = useUser({
    redirectTo: "/login",
  });
  
  const { tasks: upcomingTasks } = useTasks(user, false, "upcoming");
  const router = useRouter();
  const upcomingTaskList = upcomingTasks?.map((task) =>
    <li key={task._id} className="list-hover" style={{ margin: "0.5em", background: "#f8f8f8", padding: "5px", borderWidth: "2px", borderStyle: "solid", borderColor: "darkgray", borderRadius: "10px", width: "auto" }} onClick={() => router.push(`/tasks/${task._id}`)}>
      {task.priority ? <><span title="Priority">&#10071;</span></> : null}<b>{task.name}</b> - {task.description.slice(0,25).trim()}... (due <DueDate timestamp={task.dueDate}/>{task.dueDate !== 0 ? <>, on {moment.unix(task.dueDate).format("dddd, MMMM Do YYYY, h:mm:ss a")}</> : null})
    </li>
  );
  const { tasks: recentTasks } = useTasks(user, false, "recent");
  const recentTaskList = recentTasks?.map((task) =>
    <li key={task._id} className="list-hover" style={{ margin: "0.5em", background: "#f8f8f8", padding: "5px", borderWidth: "2px", borderStyle: "solid", borderColor: "darkgray", borderRadius: "10px", width: "auto" }} onClick={() => router.push(`/tasks/${task._id}`)}>
      {task.priority ? <><span title="Priority">&#10071;</span></> : null}<b>{task.name}</b> - {task.description.slice(0,25).trim()}... (due <DueDate timestamp={task.dueDate}/>{task.dueDate !== 0 ? <>, on {moment.unix(task.dueDate).format("dddd, MMMM Do YYYY, h:mm:ss a")}</> : null})
    </li>
  );
  const { tasks: collections } = useTasks(user, true, false);
  const collectionList = collections?.map((collection) =>
    <li key={collection._id} className="list-hover" style={{ margin: "0.5em", background: "#f8f8f8", padding: "5px", borderWidth: "2px", borderStyle: "solid", borderColor: "darkgray", borderRadius: "10px", width: "auto" }} onClick={() => router.push(`/collections/${collection._id}`)}>
      {collection.owner === user.id ? <><span title="You own this collection">&#128273;</span>{' '}</> : null}<b>{collection.name}</b> - {collection.description.slice(0,25).trim()}... (created <DueDate timestamp={collection.created}/>)
    </li>
  );
  
  if (!user || !user.isLoggedIn || user.permissions.banned) {
    return (
      <Loading/>
    );
  }
  return (
    <Layout>
      <h1>
        {user ? 
        <>
        Welcome back, {user.username}!{user.permissions.verified ? <>{' '}<span title="Verified">&#9989;</span></> : null}{user.permissions.admin ? <>{' '}<span title="Admin">&#128737;</span></> : null}
        </>
        :
        <>
        Welcome back!
        </>
        }
      </h1>

      <h2>Upcoming tasks:</h2>
      {upcomingTaskList === undefined || upcomingTaskList.length === 0 ?
      <>
      {upcomingTaskList?.length === 0 ? <p style={{ fontStyle: "italic" }}>You have no upcoming tasks, great job!</p> : <p style={{ fontStyle: "italic" }}>Loading tasks...</p>}
      </>
      :
      <><ul style={{ display: "table" }}>
        {upcomingTaskList}
      </ul></>
      }
      
      <h2>Recently added:</h2>
      {recentTaskList === undefined || recentTaskList.length === 0 ?
      <>
      {recentTaskList?.length === 0 ? <p style={{ fontStyle: "italic" }}>You have no recent tasks.</p> : <p style={{ fontStyle: "italic" }}>Loading tasks...</p>}
      </>
      :
      <><ul style={{ display: "table" }}>
        {recentTaskList}
      </ul></>
      }
      
      <h2>Your collections:</h2>
      {collectionList === undefined || collectionList.length === 0 ?
      <>
      {collectionList?.length === 0 ? <p style={{ fontStyle: "italic" }}>You haven&apos;t created or joined any collections.</p> : <p style={{ fontStyle: "italic" }}>Loading collections...</p>}
      </>
      :
      <><ul style={{ display: "table" }}>
        {collectionList}
      </ul></>
      }
    </Layout>    
  );
}
