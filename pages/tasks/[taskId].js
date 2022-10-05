import React, { useState } from "react";
import Layout from "components/Layout";
import Loading from "components/Loading";
import TaskEditForm from "components/TaskEditForm";
import useUser from "lib/useUser";
import useTasks from "lib/useTasks";
import fetchJson, { FetchError } from "lib/fetchJson";
import { useRouter } from 'next/router';
import moment from "moment";
import Link from "next/link";

export default function Task() {
  const { user } = useUser({
    redirectTo: "/login",
  });
  const { tasks, error } = useTasks(user, false, "all");
  
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const { taskId } = router.query;
  const task = tasks?.filter(item => item._id === taskId)?.[0];
  var clientError;
  if (tasks && !task) {
    clientError = "Task not found";
  }
  
  if (!user || !user.isLoggedIn || user.permissions.banned) {
    return (
      <Loading/>
    );
  }
  
  return (
    <Layout>
      <h2>{task ? <>{task.name}:</> : 'Loading...'}</h2>
      <Link href="/dashboard">Back to dashboard</Link><br/>
      {task ?
        <><h3>General information</h3>
        <p>Description: {task.description}</p>
        <p title={moment.unix(task.dueDate).format("dddd, MMMM Do YYYY, h:mm:ss a")}>Due date: {task.dueDate > 0 ? <>{moment.unix(task.dueDate).format("dddd, MMMM Do YYYY, h:mm:ss a")}{' '}({moment.unix(task.dueDate).fromNow()})</> : 'never'}</p>
        <p>Priority: {task.priority ? <>&#9989;</> : <>&#10060;</>}</p>
        <p>Completed: {task.completion.completed > 0 ? <>&#9989;</> : <>&#10060;</>}</p>
        {task.completion.completed > 0 && <>
        <p>Completed on: {moment.unix(task.completion.completed).format("dddd, MMMM Do YYYY, h:mm:ss a")}{' '}({moment.unix(task.completion.completed).fromNow()})</p>
        <p>Completed by: {task.completion.completedBy}</p>
        </>}
        <hr/>
        <details>
          <summary>Edit task</summary>
          <br/><TaskEditForm
            errorMessage={errorMsg}
            task={task}
            onSubmit={async function handleSubmit(event) {
              event.preventDefault();
              document.getElementById("editTaskBtn").disabled = true;
              
              const body = {};
              if (event.currentTarget.name.value !== event.currentTarget.name.defaultValue) {body.name = event.currentTarget.name.value};
              if (event.currentTarget.description.value !== event.currentTarget.description.defaultValue) {body.description = event.currentTarget.description.value};
              if (event.currentTarget.dueDate.value !== event.currentTarget.dueDate.defaultValue) {
                if (event.currentTarget.dueDate.value) {
                  const offset = new Date().getTimezoneOffset();
                  const utcDueDate = moment(event.currentTarget.dueDate.value, moment.HTML5_FMT.DATETIME_LOCAL).utcOffset(offset);
                  body.dueDate = utcDueDate;
                } else {
                  body.dueDate = "";
                }
              }
              if (event.currentTarget.priority.checked !== event.currentTarget.priority.defaultChecked) {body.priority = event.currentTarget.priority.checked;}
              body.completion = {};
              if (event.currentTarget.complete.checked !== event.currentTarget.complete.defaultChecked) {
                if (event.currentTarget.complete.checked) {
                  body.completion.completed = Math.floor(Date.now()/1000);
                  body.completion.completedBy = user.id;
                } else {
                  body.completion.completed = 0;
                  body.completion.completedBy = "";
                }
              }

              try {
                await fetchJson(`/api/tasks?id=${task._id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(body),
                })
                router.reload();
              } catch (error) {
                if (error instanceof FetchError) {
                  setErrorMsg(error.data.message);
                } else {
                  console.error("An unexpected error happened:", error);
                }
                document.getElementById("editTaskBtn").disabled = false;
              }
            }}
        />
        </details></>
      :
        <>{error || clientError ? <p>{clientError ? clientError : error.data.message}</p> : <p style={{ fontStyle: "italic" }}>Loading task...</p>}</>
      }
    </Layout>
  );
}
