import { useTranslation, Trans } from 'react-i18next';
import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import CheckIcon from '@mui/icons-material/Check';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useAuth } from 'react-oidc-context';
import { useFetchUserProfileQuery, useSaveUserDataMutation } from './userApi';
import type { Target } from '../types';

export const UserSettings = ({target}: {target: Target[]}) => {
  const { t } = useTranslation('user');
  return (
    <Container>
      <Grid container>
        <Grid xs={12} mdOffset={2.5} md={7}>
          <Typography variant="h1">{t('userSettings')}</Typography>
          {target.map( t =>
            <UserSettingsItem key={t.authKey} target={t} />
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

const UserSettingsItem = ({target}: {target: Target}) => {
  const auth = useAuth();
  const { t } = useTranslation('user');
  const { data } = useFetchUserProfileQuery({provider: auth.settings.authority, id: auth.settings.client_id});
  const [apiValue, setApiValue] = useState('Loading...');

  console.log(auth)

  // set API key value once it's been retrieved
  useEffect(() => data && setApiValue((data.attributes[target.authKey] && data.attributes[target.authKey][0]) || ''), [data, target.authKey]);

  // call keycloak to save new API key
  const [saveData, {isUninitialized, isLoading, isSuccess, isError}] = useSaveUserDataMutation();

  return (
    <Stack direction="column" alignItems="flex-start" mb={4}>
      <Typography variant="h6">{t('apiKeyHeader', {type: target.name})}</Typography>
      <Typography mb={3}>
        <Trans
          i18nKey="user:apiKeyDescription"
          components={[
            <Link href={target.keyUrl} target="_blank"/>
          ]}
        />
      </Typography>
      <TextField 
        id={target.authKey} 
        label={t('apiKeyLabel', {type: target.name})} 
        variant="outlined" 
        sx={{width: '100%', flex: 1}}
        value={apiValue}
        onChange={(e) => setApiValue(e.target.value)}
        onBlur={() => saveData({
          provider: auth.user?.profile.iss,
          id: auth.user?.profile.aud,
          content: {
            // need to pass along the entire account object to Keycloak
            ...data,
            attributes: {
              ...data.attributes,
              [target.authKey]: apiValue
            },
          }})
        }
        InputProps={{
          endAdornment: data && data.attributes[target.authKey] && data.attributes[target.authKey][0] &&
            <InputAdornment position="end">
              <CheckIcon />
            </InputAdornment>
          ,
        }}
      />
    </Stack>
  )
}