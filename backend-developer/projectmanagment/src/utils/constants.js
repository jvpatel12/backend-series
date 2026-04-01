export const UserRolesEnum = {
    ADMIN : "admin",
    PROJECT_ADMIN:"project_admin",
    MEMBER : "member"
}

export const availableUserRoles = Object.values(UserRolesEnum);

export const TaskStatusEnum = {
    TODO :"todo",
    IN_PROGRESS : "in_progress",
    DONE : "done"
}

export const availableTaskStatus = Object.values(TaskStatusEnum);



//the have created a object and task than can be used in other files 
//to avoid hardcoding the value again and again
 