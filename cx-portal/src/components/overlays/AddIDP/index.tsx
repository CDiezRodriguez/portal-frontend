/********************************************************************************
 * Copyright (c) 2021, 2023 BMW Group AG
 * Copyright (c) 2021, 2023 Contributors to the Eclipse Foundation
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

import { useTranslation } from 'react-i18next'
import {
  Button,
  DialogActions,
  DialogContent,
  DialogHeader,
  Radio,
} from 'cx-portal-shared-components'
import { useDispatch } from 'react-redux'
import { closeOverlay, show } from 'features/control/overlay/actions'
import { useState } from 'react'
import { updateData, UPDATES } from 'features/control/updatesSlice'
import {
  IdentityProviderUpdate,
  IDPAuthType,
  OIDCAuthMethod,
  OIDCSignatureAlgorithm,
  useAddIDPMutation,
  useUpdateIDPMutation,
} from 'features/admin/idpApiSlice'
import { OVERLAYS } from 'types/Constants'
import { ValidatingInput } from '../CXValidatingOverlay/ValidatingForm'
import { isCompanyName } from 'types/Patterns'
import { getCentralIdp } from 'services/EnvironmentService'

enum IDPType {
  COMPANY = 'Company',
  SHARED = 'Shared',
}

const SelectIdpAuthType = ({
  onChange,
}: {
  onChange: (value: IDPAuthType) => void
}) => {
  const [type, setType] = useState<IDPAuthType>(IDPAuthType.OIDC)
  return (
    <div style={{ padding: '30px 0px' }}>
      <Radio
        name="radio-buttons"
        label={IDPAuthType.OIDC}
        checked={type === IDPAuthType.OIDC}
        onChange={() => {
          setType(IDPAuthType.OIDC)
          onChange(IDPAuthType.OIDC)
        }}
        value={IDPAuthType.OIDC}
        inputProps={{ 'aria-label': IDPAuthType.OIDC }}
      />
      <Radio
        name="radio-buttons"
        disabled={true}
        label={IDPAuthType.SAML}
        checked={type === IDPAuthType.SAML}
        onChange={() => {
          setType(IDPAuthType.SAML)
          onChange(IDPAuthType.SAML)
        }}
        value={IDPAuthType.SAML}
        inputProps={{ 'aria-label': IDPAuthType.SAML }}
      />
    </div>
  )
}

type AddIDPPrepareFormType = {
  type: IDPType
  authType: IDPAuthType
  name: string
}

const initialAddIDPPrepareForm = {
  type: IDPType.COMPANY,
  authType: IDPAuthType.OIDC,
  name: '',
}

const AddIDPPrepareForm = ({
  onChange,
}: {
  onChange: (value: AddIDPPrepareFormType) => void
}) => {
  const { t } = useTranslation('idp')
  const [formData, setFormData] = useState<AddIDPPrepareFormType>(
    initialAddIDPPrepareForm
  )

  return (
    <>
      <ValidatingInput
        name="name"
        label={t('field.name')}
        validate={isCompanyName}
        onValid={(_name, value) => {
          if (!value) return
          const currentData = { ...formData }
          currentData.name = value
          setFormData(currentData)
          onChange(currentData)
        }}
      />
      <SelectIdpAuthType
        onChange={(value) => {
          const currentData = { ...formData }
          currentData.authType = value
          setFormData(currentData)
          onChange(currentData)
        }}
      />
    </>
  )
}

export const AddIdp = () => {
  const { t } = useTranslation('idp')
  const dispatch = useDispatch()
  const [formData, setFormData] = useState<AddIDPPrepareFormType>(
    initialAddIDPPrepareForm
  )
  const [addIdp] = useAddIDPMutation()
  const [updateIdp] = useUpdateIDPMutation()

  const doCreateIDP = async () => {
    try {
      const idp = await addIdp(formData.authType).unwrap()
      const idpUpdateData: IdentityProviderUpdate = {
        identityProviderId: idp.identityProviderId,
        body: {
          displayName: formData.name,
          oidc: {
            metadataUrl: `${getCentralIdp()}/realms/CX-Central/.well-known/openid-configuration`,
            clientAuthMethod: OIDCAuthMethod.SECRET_BASIC,
            clientId: '',
            secret: '',
            signatureAlgorithm: OIDCSignatureAlgorithm.ES256,
          },
        },
      }
      await updateIdp(idpUpdateData).unwrap()
      dispatch(updateData(UPDATES.IDP_LIST))
      dispatch(show(OVERLAYS.UPDATE_IDP, idp.identityProviderId))
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <DialogHeader
        title={t('add.title')}
        intro={t('add.subtitle')}
        closeWithIcon={true}
        onCloseWithIcon={() => dispatch(closeOverlay())}
      />
      <DialogContent>
        <AddIDPPrepareForm onChange={(data) => setFormData(data)} />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => dispatch(closeOverlay())}>
          {t('action.cancel')}
        </Button>
        <Button
          variant="contained"
          disabled={!formData.name}
          onClick={() => doCreateIDP()}
        >
          {t('action.confirm')}
        </Button>
      </DialogActions>
    </>
  )
}