interface EmployeeProps{
    name:string;
    email:string;
    role:string;
}
export default function Employee(props:EmployeeProps)
{
    return(
        <div>
            <h3>{props.name}</h3>
            <p>Email:{props.email}</p>
            <p>Role:{props.role}</p>
        </div>
    );
}