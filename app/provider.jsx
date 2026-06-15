"use client"
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";
import React, { useEffect, useState } from "react"
import { SelectedChapterIndexContext } from "@/context/SelectedChapterIndexContext";

function Provider({ children }) {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState();
  const [selectedChapterIndex,setSelectedChapterIndex]=useState(0);


  useEffect(() => {
    user && CreateNewUser();
  }, [user]);
  const CreateNewUser = async () => {
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress
      })
    });
    const result = await response.json();
    console.log(result);
    setUserDetail(result);
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <SelectedChapterIndexContext.Provider value={{selectedChapterIndex,setSelectedChapterIndex}}>
        <div>
          {children}
        </div>
      </SelectedChapterIndexContext.Provider>
    </UserDetailContext.Provider>

  )
}
export default Provider
