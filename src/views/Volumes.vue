<template>
  <b-overlay :show="isLoading" rounded="sm">
		<div class="mt-3 d-flex justify-content-center align-items-center gap-3">
			<h1>Volumes</h1>
			<b-button
				@click="$bvModal.show('new-volume')"
				class="btn-sm h-50 pl-3"
				variant="success"
			>
				Criar novo volume
			</b-button>
		</div>

    <b-table
      class="volume-table mt-4"
      v-if="volumes"
      :items="volumes"
      :fields="fields"
      stacked="md"
      small
    >
      <template #cell(actions)="row">
        <b-button
          size="sm"
          @click="$router.push(`/volume/${row.item.id}`)"
          class="mr-1"
        >
          Detalhes
        </b-button>
        <b-button
          size="sm"
          @click="confirmDeleteVolume(row.item)"
          class="mx-2 btn btn-danger"
        >
          Remover
        </b-button>
      </template>
    </b-table>

    <b-modal id="confirm-delete" title="Remover volume">
      <p v-if="currentVolume">
        Você tem certeza que deseja remover o volume com a sigla:
        <b> {{ currentVolume.initials }} </b>, Edição
        <b>{{ currentVolume.edition }}</b>,
				iniciado em <b>{{ currentVolume.startDate }}</b> ?
      </p>
      <template #modal-footer="">
        <b-button variant="success" @click="handleDeleteVolume">
          Remover
        </b-button>
        <b-button variant="danger" @click="cancelDeleteVolume"
          >Cancelar</b-button
        >
      </template>
    </b-modal>

		<b-modal id="new-volume" title="Novo volume">
			<b-row>
        <b-col cols="6">
          <b-form-group
            invalid-feedback="Iniciais inválidas"
            label="Iniciais"
            label-for="volume-initials"
            label-align-sm="right"
          >
            <b-form-input
              id="volume-initials"
              type="text"
							v-on:input="clearError('initials')"
              v-model="form.initials"
              :state="formValidator.initials"
              trim
            ></b-form-input>
          </b-form-group>
        </b-col>
				<b-col cols="6">
          <b-form-group
            invalid-feedback="Edição inválida"
            label="Edição"
            label-for="volume-edition"
            label-align-sm="right"
          >
            <b-form-input
              id="volume-edition"
              type="number"
							v-on:input="clearError('edition')"
              v-model="form.edition"
              :state="formValidator.edition"
              trim
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

			<b-row class="my-2">
        <b-col cols="6">
          <b-form-group
            invalid-feedback="Descrição inválida"
            label="Descrição em português"
            label-for="volume-portuguese-description"
            label-align-sm="right"
          >
            <b-form-input
              id="volume-portuguese-description"
              type="text"
							v-on:input="clearError('portugueseDescription')"
              v-model="form.portugueseDescription"
              :state="formValidator.portugueseDescription"
              trim
            ></b-form-input>
          </b-form-group>
        </b-col>
				<b-col cols="6">
          <b-form-group
            invalid-feedback="Descrição inválida"
            label="Descrição em inglês"
            label-for="volume-english-description"
            label-align-sm="right"
          >
            <b-form-input
              id="volume-english-description"
              type="text"
							v-on:input="clearError('englishDescription')"
              v-model="form.englishDescription"
              :state="formValidator.englishDescription"
              trim
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

			<b-row class="my-2">
        <b-col cols="6">
          <b-form-group
            invalid-feedback="Cidade inválida"
            label="Cidade"
            label-for="volume-city"
            label-align-sm="right"
          >
            <b-form-input
              id="volume-city"
              type="text"
							v-on:input="clearError('city')"
              v-model="form.city"
              :state="formValidator.city"
              trim
            ></b-form-input>
          </b-form-group>
        </b-col>
				<b-col cols="6">
          <b-form-group
            invalid-feedback="Data inválida"
            label="Data início"
            label-for="volume-start-date"
            label-align-sm="right"
          >
						<b-form-datepicker
							id="volume-start-date"
							v-on:input="clearError('startDate')"
							v-model="form.startDate"
							:state="formValidator.startDate"
						></b-form-datepicker>
          </b-form-group>
        </b-col>
      </b-row>

      <template #modal-footer="">
        <b-button variant="success" @click="createVolume">
          Criar
        </b-button>
        <b-button variant="danger" @click="cancelCreateVolume"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
  </b-overlay>
</template>

<script>
import eventApi from "@/services/eventApi";
import moment from "@/utils/moment";

export default {
  name: "volumes-component",
  data: () => ({
    currentVolume: null,
    isLoading: false,
    fields: [
      {
        key: "initials",
        label: "Sigla",
        sortable: true,
      },
      {
        key: "edition",
        label: "Nº Edição",
        sortable: true,
      },
      {
        key: "startDate",
        label: "Data",
        sortable: true,
      },
      { key: "actions", label: "" },
    ],
    volumes: null,
		form: {
      initials: null,
      edition: null,
      city: null,
      startDate: null,
      portugueseDescription: null,
      englishDescription: null,
    },
		formValidator: {
      initials: undefined,
      edition: undefined,
      city: undefined,
      startDate: undefined,
      portugueseDescription: undefined,
      englishDescription: undefined,
    },
  }),
  methods: {
    confirmDeleteVolume(volume) {
      this.currentVolume = volume;
      this.$bvModal.show("confirm-delete");
    },
    cancelDeleteVolume() {
      this.currentVolume = null;
      this.$bvModal.hide("confirm-delete");
    },
    async handleDeleteVolume() {
      try {
        this.isLoading = true;
        this.$bvModal.hide("confirm-delete");
        await eventApi.deleteVolume({ volume: this.currentVolume });
				this.volumes = this.volumes.filter(volume => volume.id !== this.currentVolume.id)
        this.currentVolume = null;
			} catch (error) {
        console.log(error);
        this.$bvModal.show("confirm-delete");
      }
      this.isLoading = false;
    },
		isValidForm() {
			const invalidInputs = [];

			Object.keys(this.formValidator).forEach(key => {
				if (!this.form[key]) {
					this.formValidator[key] = false;
					invalidInputs.push(key);
				} else {
					this.formValidator[key] = true;
				}
			});

			return invalidInputs.length === 0;
		},
		async createVolume() {
			const isValidForm = this.isValidForm();
			if (!isValidForm) return;

			try {
				this.isLoading = true;
				this.$bvModal.hide('new-volume')
				const { data } = await eventApi.createVolume({ volume: this.form });
				this.volumes.push({
					...data,
					startDate: moment(data.startDate).format("DD/MM/YYYY")
				});
				
				console.log(data);
			} catch (error) {
				this.$bvModal.show('new-volume')
				console.log(error);
			}
			this.isLoading = false;
		},
		clearError(field) {
			this.formValidator[field] = undefined;
		},
		cancelCreateVolume() {
			this.form = {
				initials: null,
				edition: null,
				city: null,
				startDate: null,
				portugueseDescription: null,
				englishDescription: null,
			};

			this.formValidator = {
				initials: undefined,
				edition: undefined,
				city: undefined,
				startDate: undefined,
				portugueseDescription: undefined,
				englishDescription: undefined,
			},
			this.$bvModal.hide('new-volume')
		}
  },
  async mounted() {
    try {
      this.isLoading = true;
      const { data } = await eventApi.getVolumes();
      this.volumes = data.map(volume => ({
				...volume,
				startDate: moment(volume.startDate).format("DD/MM/YYYY")
			}));
    } catch (error) {
      console.log(error);
    }
    this.isLoading = false;
  },
};
</script>

<style lang="scss">
.volume-table {
  .sr-only {
    display: none;
  }
}

.modal-dialog {
  .close {
    background: none;
    border: 0;
    font-size: 20px;
  }
}
</style>
