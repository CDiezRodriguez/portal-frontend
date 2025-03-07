/********************************************************************************
 * Copyright (c) 2024 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ********************************************************************************/

import { Box, Link, ListItem } from '@mui/material'
import './style.scss'

export const WraperLink = ({
  children,
  onClick,
}: {
  children: JSX.Element
  onClick: () => void
}): JSX.Element => {
  return (
    <Box
      sx={{
        margin: '5px 0px 10px 10px',
        borderRadius: '16px',
        ':hover': {
          backgroundColor: 'rgba(15, 113, 203, 0.05)',
        },
      }}
      onClick={onClick}
    >
      <ListItem
        sx={{
          paddingLeft: '10px',
        }}
      >
        <Link
          className="titleBox"
          sx={{
            color: 'text.primary',
            ':hover': {
              color: 'primary.dark',
              '.MuiSvgIcon-root': {
                color: 'primary.dark',
              },
            },
          }}
        >
          {children}
        </Link>
      </ListItem>
    </Box>
  )
}
