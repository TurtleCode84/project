import React from "react";
import moment from "moment";
import Layout from "components/Layout";
import Loading from "components/Loading";
import DueDate from "components/DueDate";
import useUser from "lib/useUser";
import useTasks from "lib/useTasks";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useUser({
    redirectTo: "/login",
  });
  const { tasks } = useTasks(user);
  const sortedTasks = tasks?.sort((a, b) => (a.dueDate === 0 || b.priority) ? 1 : -1);
  const taskList = sortedTasks?.map((task) =>
    <li key={task._id} style={{ margin: "0.5em", padding: "5px 5px 5px 5px", borderStyle: "ridge", borderWeight: "5px", borderRadius: "10px", width: "auto" }}>
      {task.priority ? <>&#10071;</> : null}<Link href={`/tasks/${task._id}`}>{task.name}</Link> - {task.description.slice(0,20).trim()}... (due <DueDate timestamp={task.dueDate}/>{task.dueDate !== 0 ? <>, on {moment.unix(task.dueDate).format("dddd, MMMM Do YYYY, h:mm:ss a")}</> : null})
    </li>
  );
  
  if (!user || !user.isLoggedIn || user.permissions.banned) {
    return (
      <Loading/>
    );
  }
  return (
    <><Layout>
      <h1>
        {user ? 
        <>
        Welcome back, {user.username}!{user.permissions.verified ? <>{' '}&#9989;</> : null}{user.permissions.admin ? <>{' '}&#128737;</> : null}
        </>
        :
        <>
        Welcome back!
        </>
        }
      </h1>

      <h2>Your tasks:</h2>
      {taskList === undefined || taskList.length === 0 ?
      <>
      {taskList?.length === 0 ? <p style={{ fontStyle: "italic" }}>Looks like you have no tasks!</p> : <p style={{ fontStyle: "italic" }}>Loading tasks...</p>}
      </>
      :
      <>
      <ul>
        {taskList}
      </ul>
      </>
      }
      
      <h2>Your collections:</h2>
      <p style={{ fontStyle: "italic" }}>
        Coming soon...
      </p>
    </Layout>
    
    <style jsx>{`
      Layout,
      li {
        margin: "0.5em";
        padding: "5px 5px 5px 5px";
        border-style: "ridge";
        border-weight: "5px";
        borderRadius: "10px";
        width: "auto";
        transition: background 1s;
      }
      li:hover {
        background: #d1d1d1;
      }
    `}</style></>
  );
}
