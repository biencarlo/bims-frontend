import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function Indigencies() {
  return(
    <div className="px-8 py-4">
      <h1 className="text-4xl font-black pt-4 text-red-900 tracking-[-0.5px] ">Indigency Records</h1>
      <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href="/dashboard"
        >
          Dashboard
        </Link>
        <Typography
          sx={{ display: 'flex', alignItems: 'center' }}
          color="text.primary"
        >
          Indigencies
        </Typography>
      </Breadcrumbs>
    </div>
  )
}
