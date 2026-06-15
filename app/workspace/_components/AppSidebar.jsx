"use client";

import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  BookOpen,
  Compass,
  LayoutDashboard,
  PencilRulerIcon,
  UserCircle2Icon,
  WalletCards,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import AddNewCourseDialog from './AddNewCourseDialog'

const SidebarOptions=[
    {
        title:'Dashboard',
        icon:LayoutDashboard,
        path:'/workspace'
    },
    {
        title:'My Learning',
        icon:BookOpen,
        path:'/workspace/my-learning'
    },
    {
        title:'Explore Courses',
        icon:Compass,
        path:'/workspace/explore'
    },
    {
        title:'AI Tools',
        icon:PencilRulerIcon,
        path:'/workspace/ai-tools'
    },
    {
        title:'Billing',
        icon:WalletCards,
        path:'/workspace/billing'
    },
    {
        title:'Profile',
        icon:UserCircle2Icon,
        path:'/workspace/profile'
    } 
]
function AppSidebar() {
    const path=usePathname();
    return (
      <Sidebar>
        <SidebarHeader className={'p-4'}>
          <Image src={'/logo.svg'} alt='logo' width={120} height={120} color="white" />
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <AddNewCourseDialog>
                    <Button>Create New Course</Button>
                </AddNewCourseDialog>
            </SidebarGroup>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {SidebarOptions.map((item,index)=>(
                            <SidebarMenuItem key={index}>
                                <SidebarMenuButton asChild className='p-5'>
                                    <Link href={item.path} className={`text-[17px] ${path.includes(item.path) && 'text-primary bg-orange-400 rounded-md'}`}>
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          Footer
        </SidebarFooter>
      </Sidebar>
  )
}

export default AppSidebar
