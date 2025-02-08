import React from 'react'
import Heading from './Headings'
import Image from 'next/image'

let agents = [
  {
    name: "Agent 1",
    type: 'Text',
    status: 'Online',
    private: true,
    agent_unique_name: 'agent_1',
    icon: <Image src={'/icon.png'} alt='agent_1' width={50} height={50} />
  },
  {
    name: "Agent 2",
    type: 'Text',
    status: 'Online',
    private: true,
    agent_unique_name: 'agent_2',
    icon: <Image src={'/icon.png'} alt='agent_2' width={50} height={50} />
  }, {
    name: "Agent 3",
    type: 'Text',
    status: 'Online',
    private: true,
    agent_unique_name: 'agent_3',
    icon: <Image src={'/icon.png'} alt='agent_3' width={50} height={50} />
  }
]

function AgentCards() {
  return (
    <div className='flex flex-col gap-1'>
      <Heading text='Your Agents' />
      <div className='flex flex-row gap-1 justify-evenly items-center'>
        {agents.map(agent => {
          return (
            <div className='flex w-[300px] flex-col gap-1 justify-evenly  border-2 border-gray-200 rounded-md p-2'>

              <div className='flex flex-row justify-between'>
                <h1 className='text-lg font-bold'>{agent.name}</h1>
                {agent.icon}
              </div>

              <h1>{agent.status}</h1>
              <h1>{agent.type}</h1>
              <h1>{agent.private ? 'Private' : 'Public'}</h1>

            </div>
          )
        })}
      </div>

    </div>
  )
}

export default AgentCards
